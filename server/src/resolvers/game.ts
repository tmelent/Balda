import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
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
/**
 *
 * TODO:
 * - word list
 *  */

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
  @Mutation(() => Game)
  async connectToGame(
    @Ctx() { req }: MyContext,
    @Arg("gameId") gameId: number
  ) {
    // Attempt to find game and user
    const game = await Game.findOne({ id: gameId }, { relations: ["players"] });
    const user = await User.findOne(
      { id: req.session.userId },
      { relations: ["games"] }
    );
    if (game && user) {
      console.log(game);
      game.players.map((i) => console.log(i.id));
      if (!game.players.includes(user)) {
        // Add new game to current user's game list
        user.games = [...user.games, game];
        await getRepository(User).save(user);
        console.log(`User ${user.username} connected to game #${gameId}`);
        return game;
      }
      return new Error("You are already in game");
    }
    return game;
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
    @Ctx() { req }: MyContext
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
            if (!i.filled && i.isNew) {
              newLetter = i;
            }
          });

          if (!newLetter) {
            throw new Error("There is no new cell.");
          }

          // Destructuring to reduce amount of code
          const { char, filled, isNew, boxNumber } = newLetter;

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

            // Updating score
            playerNum === 0
              ? (game.scoreP1 += stringWord.length)
              : (game.scoreP2 += stringWord.length);

            // Updating game
            const updatedGame = await getRepository(Game).save(game);

            // Updating cell
            await getRepository(Letter).save({
              id: emptyCell.id,
              char,
              filled,
              isNew,
              boxNumber,
              gameField,
            });
            return updatedGame;
          }

          throw new Error(
            "Word doesn't exist in dictionary, if you're not agree with that, send word confirmation back."
          );
        }
        throw new Error("It is not your turn!");
      }
      throw new Error("Game doesn't exist or you aren't authorized.");
    } catch (error) {
      return new Error(`${error.message}`);
    }
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
