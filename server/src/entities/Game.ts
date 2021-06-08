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
  @Field(() => [String], { defaultValue: [""] })
  @Column("varchar", { default: [""], array: true })
  p1wordlist: string[];

  @Field(() => [String], {  defaultValue: [""] })
  @Column("varchar", { default: [""], array: true })
  p2wordlist: string[];

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Column({ nullable: true, default: 0 })
  scoreP1: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Column({ nullable: true, default: 0 })
  scoreP2: number;

  @Field(() => String, { nullable: false })
  @Column()
  initialWord!: string;

  @Field(() => Number, { defaultValue: 0 })
  @Column({ default: 0 })
  currentTurn: number;

  @ManyToMany(() => User, (user) => user.games)
  players: User[];

  // Every game has its own one game field
  @OneToOne(() => GameField)
  gameField: GameField;

  // Is game finished?
  @Field(() => Boolean, { defaultValue: false })
  @Column({ default: false })
  status: boolean;
}
