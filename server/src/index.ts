import express from "express";
import "reflect-metadata";
import cors from "cors";
import {
  COOKIE_NAME,
  CORS_ORIGIN,
  PORT,
  __prod__,
} from "../dev_constants/connections";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
// import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import path from "path";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import { ApolloServer } from "apollo-server-express";
import { MyContext } from "./types";
import { Game } from "./entities/Game";
import { GameField } from "./entities/GameField";
import { Letter } from "./entities/Letter";
import { User } from "./entities/User";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { GameResolver } from "./resolvers/game";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "balda",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, GameField, Letter, Game],
  });

  await conn.runMigrations();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 yrs
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "jaiodsjaadfsdfiofho2512312f",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, GameResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
    }), 
    playground: true,
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  const httpServer = createServer(app);

  const options = {
    cors: {
      origin: CORS_ORIGIN,
      methods: ["GET", "POST"],
      allowedHeaders: ["balda-socket-header"],
      credentials: true,
    },
  };

  const io = new Server(httpServer, options);

  io.on("connection", (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);
  });

  httpServer.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
