import * as React from "react";
import { Letter } from "../../generated/graphql";
import { convertLetterToCellInput } from "../../utils/GameFieldUtils";
import { Text } from "../basic/Text";
import styles from "../styles/gameFieldGridVersion.module.scss";
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
    <div className={styles.grid}>
      {letters.map((i) => {
        return (
          <Text
            className={styles.cellText}
            onClick={(e) => handleField(e, convertLetterToCellInput(i))}
            key={`cell-${i.boxNumber}`}
          >
            {i.char === "" ? null : i.char.toUpperCase()}
          </Text>
        );
      })}
    </div>
  );
};
