import * as React from "react";
import { Letter } from "../../generated/graphql";
import { convertLetterToCellInput } from "../../utils/GameFieldUtils";
import styles from "../styles/gameField.module.scss";
import { Text } from "../basic/Text";

interface GameFieldProps {
  letters: Letter[];
  handleField: Function;
}

export const GameField: React.FC<GameFieldProps> = ({
  letters,
  handleField,
}) => {
  var rows = [];
  for (var i = 0; i < letters.length; i += 5) {
    rows.push(letters.slice(i, 5 + i));
  }
  return (
    <div className={styles.gameFieldGrid}>
      {rows.map((row, i) => {
        return (
          <div className={styles.gameRow} key={`cells-row-${i}`}>
            {row.map((col) => (
              <div
                className={`${styles.gameCell}`}
                onClick={(e) => handleField(e, convertLetterToCellInput(col))}
                key={`cell-${col.boxNumber}`}
              >
                <Text className={styles.cellText}>
                  {/* Insert new char here (but not in database) */}
                  {col.char === "" ? null : col.char.toUpperCase()}
                </Text>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
