import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GameField } from "./GameField";
import { User } from "./User";

/**
 * Game entity. Has players and gameField in it.
 */
@ObjectType()
@Entity()
export class Game extends BaseEntity {
  // Game id
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Int, {nullable: false})
  @Column()
  p1id: number;

  @Field(() => Int)
  @Column({nullable: true, default: 0})
  p2id: number;

  @Field(() => Int, {defaultValue: 0})
  @Column({nullable: true, default: 0})
  scoreP1: number;

  @Field(() => Int, )
  @Column({nullable: true, default: 0})
  scoreP2: number;

  @Field(() => String, {nullable: false})
  @Column()
  initialWord!: string;

  // Players in game
  @Field(() => User, {nullable: true})
  @ManyToMany(() => User, (user) => user.games, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  players?: User[];  

  // Every game has its own one game field
  @OneToOne(() => GameField, (gameField) => gameField.game)
  gameField: GameField;

  // Is game finished?
  @Field(() => Boolean, {defaultValue: false})
  @Column()
  status: boolean;
}
