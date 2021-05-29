import { GameResolver } from "../resolvers/game";
import { GameFieldResolver } from "../resolvers/gameField";
import { UserResolver } from "../resolvers/user";
import { buildSchema } from "type-graphql";

export const createSchema = () =>
  buildSchema({
    resolvers: [UserResolver, GameResolver, GameFieldResolver],
  });
