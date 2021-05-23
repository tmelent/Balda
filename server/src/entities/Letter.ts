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
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  /** Number of the character's box. */
  @Field()
  @Column(() => Number)
  boxNumber: number;

  /** Link to game field */
  @ManyToOne(() => GameField, (gameField) => gameField.letters, {
    onDelete: 'CASCADE'
  })
  gameField: GameField;

  /** Character in box */
  @Field()
  @Column(() => String)
  char: string;

  /** Is box already filled */
  @Field()
  @Column(() => Boolean)
  filled: boolean;

  /** Is character is new in game (box was not filled before this request)*/
  @Field()
  @Column(() => Boolean)
  isNew: boolean;

  /** If the word exists in dictionary, then exists became true */
  @Field()
  @Column(() => Boolean)
  exists: boolean;
}
