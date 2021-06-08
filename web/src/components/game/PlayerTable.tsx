import * as React from "react";
import styles from "../styles/gameField.module.scss";
import { Text } from "../basic/Text";
interface PlayerTableProps {
  username: string;
  currentTurn: boolean;
  wordList: string[] | null;
  points: number;
}

export const PlayerTable: React.FC<PlayerTableProps> = ({
  username,
  wordList,
  currentTurn,
  points
}) => {
  return (
    <div className={styles.playerTable}>
      <table>
        <thead>
          <tr className={currentTurn ? styles.turn : ""}>
           <td className={styles.username}>{username} {points}</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {wordList
                ? wordList.map((i) => {
                    return (
                      <Text
                        key={`p2-word-${username}-${i}`}
                        className={styles.word}
                      >
                        {i}
                      </Text>
                    );
                  })
                : null}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
