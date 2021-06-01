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
    const existingGameField = await GameField.findOne({where: {game}});    
    if (game && !existingGameField) {
      const word = game.initialWord;      
      const gameField = await getConnection().createQueryBuilder().insert().into(GameField).values({
        gameId: gameId
      }).returning("*").execute(); 
      const res = gameField.raw[0] as GameField;      

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

      for (let i = 10; i < 15; i++) {
        arr[i].char = word[i - 10];
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
    throw Error(existingGameField ? `GameField for this game already exists.` : `This game doesn't exist.`);
  }
}
