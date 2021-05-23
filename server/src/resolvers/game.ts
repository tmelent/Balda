import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Mutation,
  //   Field,
  //   Mutation,
  //   ObjectType,
  //   FieldResolver,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Game } from "../entities/Game";
import generateRandomWord from "../utils/generateRandomWord";

/**
 * TODO:
 * - loadGame mutation
 * - createGame mutation
 * - deleteGame mutation
 * - updateGame (scoreP1, scoreP2 ..., gameField) mutation
 * - updateWord (set up initial word)
 *  */

// @ObjectType()
// class GameResponse {
//   @Field(() => Game, { nullable: true })
//   game?: Game;
// }

@Resolver(Game)
export class GameResolver {
  @Query(() => Game, { nullable: true })
  async getGame(@Arg("gameId") gameId: number, @Ctx() { req }: MyContext) {
    console.log(req.session.userId);
    const game = await Game.findOne({ id: gameId });
    if (game?.players?.filter((p) => p.id === req.session.userId).length) {
      return game;
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
    console.log(`initial word is generated: ${initialWord}`);

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Game)
      .values({      
        status: false,
        initialWord: initialWord,
        p1id: req.session.userId,        
      })
      .returning("*")
      .execute();
  }

  @Query(() => String)
  async generateWord() {
    const initialWord = await generateRandomWord();
    return initialWord;
  }
}
