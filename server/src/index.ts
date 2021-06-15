import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import Redis from "ioredis";
import path from "path";
import "reflect-metadata";
import { Server, Socket } from "socket.io";
import { buildSchema } from "type-graphql";
// import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import {
  COOKIE_NAME,
  CORS_ORIGIN,
  PORT,
  __prod__,
} from "../dev_constants/connections";
import { Game } from "./entities/Game";
import { GameField } from "./entities/GameField";
import { Letter } from "./entities/Letter";
import { User } from "./entities/User";
import { GameResolver } from "./resolvers/game";
import { GameFieldResolver } from "./resolvers/gameField";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import { GraphQLUtil } from "./utils/gqlCall";
import { MAKE_CONFIRMED_TURN } from "./graphql/mutations";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "balda",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, GameField, Game, Letter],
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

  const gqlSchema = await buildSchema({
    resolvers: [UserResolver, GameResolver, GameFieldResolver],
    validate: false,
  });

  const graphqlUtil = new GraphQLUtil(gqlSchema);

  const apolloServer = new ApolloServer({
    schema: gqlSchema,
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
      origin: CORS_ORIGIN,
      methods: ["GET", "POST"],
      allowedHeaders: ["balda-socket-header"],
      credentials: true,
    },
  };

  const io = new Server(httpServer, options);

  io.on("connection", (socket: Socket) => {
    exports.socket = socket;
    exports.io = io;
    socket.emit("connection");
    socket.on("connectionToRoom", (room) => {
      console.log(`${socket.id} connected to room ${room}`);
      io.socketsJoin(`${room}`);
      console.log(socket.rooms);
      io.sockets.in(room).emit("playerJoined", socket.id);
    });
    socket.on("fieldUpdated", (room) => {
      console.log(`field updated: ${room}`)
      console.log(socket.rooms);
      socket.to(`${room}`).emit("updateGame");     
    });
    socket.on("turnConfirmed",async  (data) => {
      const socketIds = (
        await io.in(`${data.gameId}`).fetchSockets()
      ).map((i) => i.id);
      const opponentSocketId = socketIds.find((i) => i !== socket.id);
     
      io.to(`${opponentSocketId}`).emit("yourWordConfirmed", data);     
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
