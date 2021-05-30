import { User } from "../../entities/User";
import { graphqlCall } from "../../test-utils/graphqlCall";
import { testConn } from "../../test-utils/testConn";
import { Connection } from "typeorm";
import faker from "faker";
import { UsernamePasswordInput } from "../UsernamePasswordInput";
let conn: Connection;

beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

export const user: UsernamePasswordInput = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  username: faker.internet.userName(),
};

const registerMutation = `
mutation Register($data: UsernamePasswordInput!) {
  register(
    options: $data
  ) {
    user {
      id
      username
      email
    }    
  }
}
`;

const loginMutation = `
mutation login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password){
      user{
        username
        email
      }
    }
  }
`;

describe("Register", () => {
  it("Creates new user", async () => {
    const response = await graphqlCall({
      source: registerMutation,
      variableValues: { data: user },
    });

    if (response.errors) {
      console.log(response.errors[0].originalError);
    }

    expect(response).toMatchObject({
      data: {
        register: {
          user: {
            username: user.username,
            email: user.email,
          },
        },
      },
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser!.username).toBe(user.username);
  });

  const loginExpect = (response: any) => {
    return expect(response).toMatchObject({
      data: {
        login: {
          user: {
            username: user.username,
            email: user.email,
          },
        },
      },
    });
  };
  describe("Login", () => {
    it("Logging in user with email", async () => {
      const response = await graphqlCall({
        source: loginMutation,
        variableValues: {
          usernameOrEmail: user.email,
          password: user.password,
        },
      });

      if (response.errors) {
        console.log(response.errors);
      }   
      loginExpect(response);
    });
    it("Logging in user with username", async () => {
      const response = await graphqlCall({
        source: loginMutation,
        variableValues: {
          usernameOrEmail: user.username,
          password: user.password,
        },
      });

      if (response.errors) {
        console.log(response.errors);
      }

      loginExpect(response);
    });
  });
});
