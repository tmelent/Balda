import { Field, InputType, Int } from "type-graphql";
import { Column } from "typeorm";
import { Letter } from "./Letter";

@InputType()
export class CellInput implements Partial<Letter> {

  @Field(() => Int)
  id: number;

  @Field(() => Int)
  boxNumber: number;

  @Field(() => String)
  char: string;

  @Field(() => Boolean)
  filled: boolean;

  @Field()
  @Column()
  isNew: boolean;
}
