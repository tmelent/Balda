import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,   
  Entity, 
  JoinColumn, 
  JoinTable, 
  OneToOne, 
  PrimaryColumn
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
  @PrimaryColumn()
  gameId!: number;

  @OneToOne(() => Game)
  @JoinColumn()
  game: Game
  
  @Field(() => [Letter!]!)  
  @JoinTable() 
  letters: Letter[];
}
