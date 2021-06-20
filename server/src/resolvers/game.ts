import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UnauthorizedError,
} from "type-graphql";
import { getRepository } from "typeorm";
import { Game } from "../entities/Game";
import generateRandomWord from "../utils/generateRandomWord";
import { GameField } from "../entities/GameField";
import { Letter } from "../entities/Letter";
import { dictionary } from "../dictionary/dictionary";
import { CellInput } from "../entities/CellInput";
import { v4 } from "uuid";
import { JOIN_GAME_PREFIX } from "../connections";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

// import { Socket } from "socket.io";

@ObjectType()
class GameFieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class GameResponse {
  @Field(() => [GameFieldError], { nullable: true })
  errors?: GameFieldError[];

  @Field(() => Game, { nullable: true })
  game?: Game;
}

@Resolver(Game)
export class GameResolver {
  // Joining user to game

  @FieldResolver(() => [User], { nullable: true })
  async players(@Root() game: Game) {
    const p = await getRepository(Game)
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.players", "user")
      .where("game.id = :gameId", { gameId: game.id })
      .getOne();
    if (p !== undefined) {
      return p.players;
    }
    console.log(p);
    return null;
  }

  // Joining gameField to game
  @FieldResolver(() => GameField)
  async gameField(@Root() game: Game) {
    return await GameField.findOne({ where: { game } });
  }

  /**
   * Connects user to existing game as player #2.
   * @param gameId Id of current game
   * @returns Updated game
   */
  @Mutation(() => GameResponse)
  async connectToGame(
    @Arg("token") token: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<GameResponse> {
    const key = JOIN_GAME_PREFIX + token;
    const gameId = await redis.get(key);
    if (!gameId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const gameIdNum = parseInt(gameId);
    const game = await Game.findOne(
      { id: gameIdNum },
      { relations: ["players"] }
    );
    const user = await User.findOne(
      { id: req.session.userId },
      { relations: ["games"] }
    );
    if (!game) {
      return {
        errors: [
          {
            field: "token",
            message: "game no longer exists",
          },
        ],
      };
    }

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user doesn't exist",
          },
        ],
      };
    }

    try {
      // await User.update(
      //   { id: req.session.userId },
      //   { games: [...user.games, game] }
      // );
      user.games = [...user.games, game];
      await getRepository(User).save(user);
      await redis.del(key);
    } catch (error) {
      console.error(error);
    }
    return { game };
  }

  @Mutation(() => String)
  async createInvitation(
    @Arg("gameId") gameId: number,
    @Ctx() { redis }: MyContext
  ): Promise<string> {
    const game = await Game.findOne({ where: { id: gameId } });
    if (!game) {
      return "";
    }
    const token = v4();

    await redis.set(
      JOIN_GAME_PREFIX + token,
      gameId,
      "ex",
      1000 * 60 * 60 * 24
      // 1 day exp token
    );
    return token;
  }

  /**
   * Handles player's attempt to make turn.
   * @param gameId Id of Game.
   * @param word Array of Letter-like (CellInput) objects, containing items in correct order.
   * Example: [{char: 's'}, {char: 'a'}, {char: 'n'}, {char: 'd'}]
   * @param confirmed Approval of unlisted word. Default: false.
   *
   * @returns Updated game
   */
  @Mutation(() => Game)
  async makeTurn(
    @Arg("gameId") gameId: number,
    @Arg("word", () => [CellInput]) word: CellInput[],
    @Arg("confirmed", { defaultValue: false }) confirmed: boolean,
    @Arg("socketId") socketId: string,
    @Ctx() { req, io }: MyContext
  ) {
    // Trying to find game, gameField and current user in DB
    const game = await Game.findOne({ id: gameId }, { relations: ["players"] });
    const currUser = await User.findOne({ id: req.session.userId });
    const gameField = await GameField.findOne({ where: { gameId } });
    // Index of player in game.players
    let playerNum;
    // Checking if user is connected to the game

    try {
      if (currUser && game) {
        if (currUser.id === game.players[0].id) {
          playerNum = 0;
        } else {
          if (currUser.id == game.players[1].id) {
            playerNum = 1;
          } else {
            throw new Error("You are not connected to this game.");
          }
        }

        // Checking if it's this player's turn.
        if (game.currentTurn === playerNum) {
          // Later will be used to count points and adding it to list of player's words
          let stringWord = "";
          // New cell
          let newLetter: CellInput | null = null;

          word.map((i) => {
            // Checking if cell can exist in this gamefield
            if (i.boxNumber > 24 || i.boxNumber < 0) {
              throw new Error("Box number is not correct.");
            }
            // Creating word from array items
            stringWord += i.char;
            // Checking if array has new cell
            if (i.isNew) {
              newLetter = i;
            }
          });

          console.log(`stringWord: ${stringWord}`);
          if (
            game.p1wordlist.includes(stringWord) ||
            game.p2wordlist.includes(stringWord) ||
            stringWord === game.initialWord
          ) {
            throw new Error("Word has been already used in game.");
          }

          if (newLetter === null) {
            throw new Error("There is no new cell.");
          }

          // Destructuring to reduce amount of code
          const { char, boxNumber } = newLetter;

          const emptyCell = await Letter.findOne({
            where: { boxNumber, gameField },
          });

          // Checking if new cell is actually empty, and we can put value in it.
          if (emptyCell?.char !== "") {
            throw new Error(
              "The cell has 'isNew' field set to true, but it is not new."
            );
          }

          if (dictionary.includes(stringWord) || confirmed) {
            // Word is approved or exists in DB.
            if (
              game.p1wordlist === undefined ||
              game.p2wordlist === undefined
            ) {
              game.p1wordlist = [];
              game.p2wordlist = [];
            }
            // Updating score
            if (playerNum === 0) {
              game.scoreP1 += stringWord.length;
              game.p1wordlist.push(stringWord);
            } else {
              game.scoreP2 += stringWord.length;
              game.p2wordlist.push(stringWord);
            }

            game.currentTurn = playerNum === 0 ? 1 : 0;
            // Updating game
            const updatedGame = await getRepository(Game).save(game);

            // Updating cell
            await getRepository(Letter).save({
              id: emptyCell.id,
              char,
              filled: true,
              isNew: false,
              boxNumber,
              gameField,
            });
            return updatedGame;
          }

          const serv = require("../index");

          const socketIds = (
            await (serv.io as Server).in(`${gameId}`).fetchSockets()
          ).map((i) => i.id);
          console.log(socketIds);

          console.log(`clients count: ${io.engine.clientsCount}`);

          const opponentSocketId = socketIds.find((i) => i === socketId);
          console.log(opponentSocketId);
          if (opponentSocketId) {
            (serv.io as Server)
              .to(`${gameId}`)
              .except(opponentSocketId)
              .emit("askWordConfirmation", {
                gameId,
                word,
                confirmed,
                stringWord,
              });
          }
          return new Error("Waiting for confirmation...");
        }
        throw new Error("It is not your turn!");
      }

      throw new Error("Game doesn't exist or you aren't authorized.");
    } catch (error) {
      return new Error(`${error.message}`);
    }
  }

  @Mutation(() => Game, { nullable: true })
  async makeConfirmedTurn(
    @Arg("gameId") gameId: number,
    @Arg("word", () => [CellInput]) word: CellInput[],
    @Arg("stringWord") stringWord: string,
    @Ctx() { req }: MyContext
  ) {
    console.log(`makeConfirmedTurn: ${gameId}, ${stringWord}`);
    const game = await Game.findOne({ id: gameId }, { relations: ["players"] });
    if (game) {
      const gameField = await GameField.findOne({ where: { gameId } });
      const currUserId = (await User.findOne({ id: req.session.userId }))!.id;
      const newCell = word.find((i) => i.isNew === true);
      const emptyCell = await Letter.findOne({
        where: { boxNumber: newCell?.boxNumber, gameField },
      });

      let playerNum;
      if (currUserId === game.players[0].id) {
        playerNum = 0;
      } else {
        if (currUserId === game.players[1].id) {
          playerNum = 1;
        } else {
          throw new Error("You are not connected to this game.");
        }
      }
      if (playerNum === 0) {
        game.scoreP1 += stringWord.length;
        game.p1wordlist.push(stringWord);
      } else {
        game.scoreP2 += stringWord.length;
        game.p2wordlist.push(stringWord);
      }

      game.currentTurn = playerNum === 0 ? 1 : 0;
      // Updating game
      const updatedGame = await getRepository(Game).save(game);
      console.log(emptyCell);
      // Updating cell
      await getRepository(Letter).save({
        id: emptyCell!.id,
        char: newCell!.char,
        filled: true,
        isNew: false,
        boxNumber: emptyCell!.boxNumber,
        gameField,
      });
      return updatedGame;
    }
    throw new Error("Game wasn't found.");
  }
  /**
   * Returns game info by its id.
   * @param gameId Game id
   * @returns Game
   */
  @Query(() => Game, { nullable: true })
  async getGame(@Arg("gameId") gameId: number, @Ctx() { req }: MyContext) {
    const game = await Game.findOne({ id: gameId });
    return game && req.session.userId
      ? game
      : new Error(
          `Game with id: ${gameId} and with player ${req.session.userId} in it was not found.`
        );
  }

  /**
   * Returns game history of current user.
   * @returns Game list.
   */
  @Query(() => [Game], { nullable: true })
  async getGameHistory(@Ctx() { req }: MyContext) {
    const user = await getRepository(User).findOne(
      { id: req.session.userId },
      { relations: ["games"] }
    );
    if (user) {
      if (!user.games) {
        return new Error(
          `Data history is empty for user ${req.session.userId}`
        );
      }
      return user.games;
    }
    return new UnauthorizedError();
  }

  /**
   * Creates new game: generates initial word and attaches game to user
   *
   * @returns New game
   */
  @Mutation(() => Game)
  async createGame(@Ctx() { req }: MyContext) {
    const initialWord = await generateRandomWord();
    const currUser = await User.findOne(
      { id: req.session.userId },
      { relations: ["games"] }
    );

    if (currUser) {
      const game = await getRepository(Game).save({
        initialWord,
        p1wordList: [""],
        p2wordList: [""],
      });
      currUser.games = [...currUser.games, game];

      await getRepository(User).save(currUser);
      return await getRepository(Game)
        .createQueryBuilder("game")
        .leftJoinAndSelect("game.players", "user")
        .where("game.id = :gameId", { gameId: game.id })
        .getOne();
    }

    throw new UnauthorizedError();
  }
}
