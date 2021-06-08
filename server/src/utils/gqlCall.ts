import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "type-graphql";

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  userId?: number;
}

/**
 * Util helps to execute GraphQL schema queries/mutations.
 */
export class GraphQLUtil {
  schema: GraphQLSchema;
  constructor(_gqlSchema: GraphQLSchema) {
    this.schema = _gqlSchema;
  }

  /** 
   * @param source - query / mutation
   * @param variableValues - required variables 
   * @param userId - user id from session 
   */
  call = async ({ source, variableValues, userId }: Options) => {
    return graphql({
      schema: this.schema,
      source,
      variableValues,
      contextValue: {
        req: {
          session: {
            userId,
          },
        },
        res: {
          clearCookie: jest.fn(),
        },
      },
    });
  };
}
