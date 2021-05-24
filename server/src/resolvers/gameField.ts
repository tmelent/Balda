import { GameField } from "../entities/GameField";

import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Game } from "../entities/Game";
import { Letter } from "../entities/Letter";
import { log } from "console";
import { getConnection } from "typeorm";
// import { createQueryBuilder } from "typeorm";

@Resolver(GameField)
export class GameFieldResolver {
  @FieldResolver(() => [Letter])
  letters(@Root() gameField: GameField) {    
    return Letter.find({where: {gameField: gameField}});
  }

  @Query(() => GameField, { nullable: true })
  async loadField(@Arg("gameId") gameId: number) {
    return await GameField.findOne(gameId);
  }

  @Mutation(() => GameField, { nullable: true })
  async generateField(
    @Arg("gameId") gameId: number
  ): Promise<GameField | null> {
    const game = await Game.findOne({ id: gameId });

    log(`game: ${game?.id}`);
    if (game) {
      const word = game.initialWord;
      log(`game exists: ${game.id}, ${game.initialWord}`);
      const gameField = await getConnection().createQueryBuilder().insert().into(GameField).values({
        gameId: gameId
      }).returning("*").execute(); 
      const res = gameField.raw[0] as GameField;
      console.log(`${res.gameId}`);
      const emptyLetter = (index: number) => {
        return {
          boxNumber: index,
          char: "",
          filled: false,
          gameField: res,
          isNew: false,
        };
      };

      const arr = Array.from({ length: 25 }, (_, k) => emptyLetter(k));

      for (let i = 9; i < 14; i++) {
        arr[i].char = word[i - 9];
        arr[i].filled = true;
      }      
        
      await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Letter)
      .values(arr)
      .returning('*')
      .execute();   

      return res;     
    }
    return null;
  }
}
