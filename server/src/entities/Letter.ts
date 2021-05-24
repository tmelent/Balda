import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,

  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GameField } from "./GameField";

/**
 * Letter entity.
 */
@ObjectType()
@Entity()
export class Letter extends BaseEntity {
  /** Number of the character's box. */
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  boxNumber: number;


  /** Link to game field */
  @ManyToOne(() => GameField, (gameField) => gameField.letters, {
    onDelete: "CASCADE",
  })  
  gameField: GameField;

  /** Character in box */
  @Field()
  @Column({nullable: true, default: ''})
  char: string;

  /** Is box already filled */
  @Field()
  @Column()
  filled: boolean;

  /** Is character is new in game (box was not filled before this request)*/
  @Field()
  @Column()
  isNew: boolean;
}
