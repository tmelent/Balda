import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Game } from "./Game";
import { Letter } from "./Letter";

/**
 * Game field entity.
 */
@ObjectType()
@Entity()
export class GameField extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Game, (game) => game.gameField, {
    onDelete: 'CASCADE'
  })
  game: Game;  
   
  @OneToMany(() => Letter, (letter) => letter.gameField)
  letters: Letter[];
}
