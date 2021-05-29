import { Game } from "../entities/Game";
import { GameField } from "../entities/GameField";
import { Letter } from "../entities/Letter";
import { User } from "../entities/User";
import { createConnection } from "typeorm";

export const testConn = (drop: boolean = false) => {
  return createConnection({        
    port: 5432,
    type: "postgres",
    database: "balda-test",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: drop,
    dropSchema: drop,
    entities: [User, GameField, Game, Letter],
  });
};

// type: "postgres",
//     database: "balda",
//     username: "postgres",
//     password: "postgres",
//     logging: true,
//     synchronize: true,
//     migrations: [path.join(__dirname, "./migrations/*")],
//     entities: [User, GameField, Game, Letter],