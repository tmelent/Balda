import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import Redis from "ioredis";
import path from "path";
import "reflect-metadata";
import { Server, Socket } from "socket.io";
import { buildSchema } from "type-graphql";
import { ConnectionOptions, createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./connections";
import { Game } from "./entities/Game";
import { GameField } from "./entities/GameField";
import { Letter } from "./entities/Letter";
import { User } from "./entities/User";
import { GameResolver } from "./resolvers/game";
import { GameFieldResolver } from "./resolvers/gameField";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";

const main = async () => {
  const prodConnectionOptions: ConnectionOptions = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    ssl: {
      rejectUnauthorized: false,
    },
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, GameField, Game, Letter],
  };

  const devConnectionOptions: ConnectionOptions = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, GameField, Game, Letter],
  };
  await createConnection(
    __prod__ ? prodConnectionOptions : devConnectionOptions
  );

  // await conn.runMigrations();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
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
        path: "/",
        domain: __prod__ ? process.env.COOKIE_DOMAIN : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      resave: false,
    })
  );

  const gqlSchema = await buildSchema({
    resolvers: [UserResolver, GameResolver, GameFieldResolver],
    validate: false,
  });

  const apolloServer = new ApolloServer({
    schema: gqlSchema,
    introspection: true,
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      io,
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
      origin: process.env.CORS_ORIGIN!,
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  };

  const io = new Server(httpServer, options);

  io.on("connection", (socket: Socket) => {
    exports.socket = socket;
    exports.io = io;
    socket.emit("connection");
    socket.on("connectionToRoom", (room) => {
      socket.join(`${room}`);
      socket.to(`${room}`).emit("playerJoined", socket.id);
    });
    socket.on("fieldUpdated", (room) => {
      socket.to(`${room}`).emit("updateGame");
    });
    socket.on("turnConfirmed", async (data) => {
      socket.to(`${data.gameId}`).emit("yourWordConfirmed", data);
    });
    socket.on("turnRejected", async (gameId) => {
      socket.to(`${gameId}`).emit("yourWordRejected");
    });
  });

  httpServer.listen(parseInt(process.env.PORT!), () => {
    console.log(`server started on ${process.env.PORT} port`);
  });
};

main().catch((err) => {
  console.error(err);
});
