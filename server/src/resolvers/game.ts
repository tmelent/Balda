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

/**
 * TODO:
 * - deleteGame mutation
 *  */
@Resolver(Game)
export class GameResolver {
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

  @FieldResolver(() => GameField)
  async gameField(@Root() game: Game) {
    return await GameField.findOne({ where: { game } });
  }

  @Mutation(() => Game)
  async connectToGame(
    @Ctx() { req }: MyContext,
    @Arg("gameId") gameId: number
  ) {
    const game = await Game.findOne({ id: gameId }, { relations: ["players"] });
    const user = await User.findOne(
      { id: req.session.userId },
      { relations: ["games"] }
    );
    if (game && user) {
      console.log(game);
      game.players.map((i) => console.log(i.id));
      if (!game.players.includes(user)) {
        user.games = [...user.games, game];
        await getRepository(User).save(user);
        console.log(`User ${user.username} connected to game #${gameId}`);
        return game;
      }
      return new Error("You are already in game");
    }
    return game;
  }

   
  // @Mutation(() => Game)
  // async makeTurn(
  //   @Arg("gameId") gameId: number,
  //   @Arg("word") word: string,
  //   @Arg("confirmed", { defaultValue: false }) confirmed: boolean,
  //   @Ctx() { req }: MyContext
  // ) {
  //   // Trying to find game and current user in DB
  //   const game = await Game.findOne({ id: gameId }, { relations: ["players"] });
  //   const currUser = await User.findOne({ id: req.session.userId });
    
  //   let playerNum; // Index of player in game.players
  //   // Checking if user is connected to the game
  //   if (currUser && game) {
  //     if (currUser === game.players[0]) {
  //       playerNum = 0;
  //     } else {
  //       if (currUser === game.players[1]) {
  //         playerNum = 1;
  //       } else {
  //         return new Error("You are not connected to this game.");
  //       }
  //     }

  //     if (game.currentTurn === playerNum) {
  //       let stringWord = "";
  //       let isNewCellPresent = false;
  //       (word as Letter[]).map((i) => {
  //         stringWord.concat(i.char);
  //         if (!i.filled && i.isNew) {
  //           isNewCellPresent = true;
  //         }
  //       });

  //       if (!isNewCellPresent) {
  //         return new Error("There is no new cell.");
  //       }

  //       if (dictionary.includes(stringWord) || confirmed) {
  //         if (playerNum === 0) {
  //           game.scoreP1 += stringWord.length;
  //         } else {
  //           game.scoreP2 += stringWord.length;
  //         }
  //         await getRepository(Game).save(game);
  //         return game;
  //       }
        
  //       return new Error(
  //         "Word doesn't exist in dictionary, if you're not agree with that, send word confirmation back."
  //       );
  //     }
  //     return new Error("It is not your turn!");
  //   }
  //   return new Error("Game doesn\'t exist or you aren\'t authorized.")
  // }

  @Query(() => Game, { nullable: true })
  async getGame(@Arg("gameId") gameId: number, @Ctx() { req }: MyContext) {
    const game = await Game.findOne({ id: gameId });
    if (game && req.session.userId) {
      return game;
    }

    console.log(
      `Game with id: ${gameId} and with player ${req.session.userId} in it was not found.`
    );
    return null;
  }

  @Query(() => [Game], { nullable: true })
  async getGameHistory(@Ctx() { req }: MyContext) {
    const user = await getRepository(User).findOne(
      { id: req.session.userId },
      { relations: ["games"] }
    );
    if (user) {
      if (!user.games) {
        console.log(`Data history is empty for user ${req.session.userId}`);
        return null;
      }
      return user.games;
    }
    return null;
  }

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
