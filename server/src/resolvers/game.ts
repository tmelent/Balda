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
} from "type-graphql";
import { getConnection } from "typeorm";
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
  async players(@Root() game: Game, @Arg("userId") userId: number) {
    const u = await User.find({
      where: [{ id: game.p2id }, { id: game.p1id }],
    });
    if (u[0] && u[1]) {
      if (u[0].id === userId || u[1].id === userId) {
        return [u];
      }
    }
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
    const game = await Game.findOne({ id: gameId });
    if (
      game?.p2id === 0 &&
      !game?.status &&
      game?.p1id !== req.session.userId
    ) {
      game.p2id = req.session.userId!;
      Game.update({ id: gameId }, game);
    }
    return game;
  }

  @Mutation(() => Game)
  async updateMyScore(
    @Arg("gameId") gameId: number,
    @Arg("isEnded") isEnded: boolean,
    @Arg("score") score: number,
    @Ctx() { req }: MyContext
  ) {
    const game = await Game.findOne({ id: gameId });
    let isGameEnded = false;
    if (game) {
      if (isEnded) {
        isGameEnded = true;
      }
      game.status = isGameEnded;
      req.session.userId === game.p1id
        ? (game.scoreP1 += score)
        : (game.scoreP2 += score);
      await Game.update({ id: gameId }, game);
    }
    return game;
  }

  @Query(() => Game, { nullable: true })
  async getGame(@Arg("gameId") gameId: number, @Ctx() { req }: MyContext) {
    const game = await Game.findOne({ id: gameId });
    if (game && req.session.userId) {
      if (this.players(game, req.session.userId)) {
        return game;
      }
    }

    console.log(
      `Game with id: ${gameId} and with player ${req.session.userId} in it was not found.`
    );
    return null;
  }

  @Query(() => [Game], { nullable: true })
  async getGameHistory(@Ctx() { req }: MyContext) {
    const gameHistory = await Game.find({
      where: [{ p1id: req.session.userId }, { p2id: req.session.userId }],
    });
    if (gameHistory) {
      return gameHistory;
    }
    console.log(`Data history is empty for user ${req.session.userId}`);
    return null;
  }

  @Mutation(() => Game)
  async createGame(@Ctx() { req }: MyContext) {
    const initialWord = await generateRandomWord();
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Game)
      .values({
        status: false,
        initialWord,
        p1id: req.session.userId,
      })
      .returning("*")
      .execute();
    const game = await Game.findOne({ where: { initialWord } });
    return game;
  }
}
