import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import "dotenv-safe/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import Redis from "ioredis";
import path from "path";
import "reflect-metadata";
import { Server, Socket } from "socket.io";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
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
  console.log(process.env.DATABASE_URL);
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, GameField, Game, Letter],
  });

  console.log(
    process.env.PORT,
    process.env.REDIS_URL,
    process.env.DATABASE_URL
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
        secure: true,
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
      console.log(`${socket.id} connected to room ${room}`);
      io.socketsJoin(`${room}`);
      console.log(socket.rooms);
      io.sockets.in(room).emit("playerJoined", socket.id);
    });
    socket.on("fieldUpdated", (room) => {
      console.log(`field updated: ${room}`);
      console.log(socket.rooms);
      socket.to(`${room}`).emit("updateGame");
    });
    socket.on("turnConfirmed", async (data) => {
      const socketIds = (await io.in(`${data.gameId}`).fetchSockets()).map(
        (i) => i.id
      );
      const opponentSocketId = socketIds.find((i) => i !== socket.id);

      io.to(`${opponentSocketId}`).emit("yourWordConfirmed", data);
    });
  });

  httpServer.listen(parseInt(process.env.PORT!), () => {
    console.log(`server started on http://localhost:${process.env.PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
