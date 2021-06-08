import { withUrqlClient } from "next-urql";
import { send } from "process";
import * as React from "react";
import { createUrqlClient } from "src/utils/createUrqlClient";
import { Flex } from "../basic/Flex";
import styles from "../styles/keyboard.module.scss";
import utilStyles from "../styles/utility.module.scss";
interface KeyboardProps {
  turn: boolean;
}
export const Keyboard: React.FC<KeyboardProps> = ({ turn }) => {
  // Cyrillic alphabet
  // Note: ё === е, и === й
  const keys = [
    "а",
    "б",
    "в",
    "г",
    "д",
    "е",
    "ж",
    "з",
    "и",
    "к",
    "л",
    "м",
    "н",
    "о",
    "п",
    "р",
    "с",
    "т",
    "у",
    "ф",
    "х",
    "ц",
    "ч",
    "ш",
    "щ",
    "ъ",
    "ы",
    "ь",
    "э",
    "ю",
    "я",
  ];

  const send = (key: string) => {
    return key;
  };
  var rows = [];
  for (var i = 0; i < keys.length; i += 11) {
    rows.push(keys.slice(i, 11 + i));
  }

  console.log(rows);
  return (
    <div >
      {rows.map((row, i) => {
        return (
          <Flex className={`${utilStyles.alignCenter}`} key={`keyboardRow-${i}`}>
            {console.log(row)}
            {row.map((key, idx) => {
              return (
                <div className={styles.key} key={`key-${idx}`}>
                  {key}
                </div>
              );
            })}
          </Flex>
        );
      })}
    </div>
  );
};

export default withUrqlClient(createUrqlClient)(Keyboard as any);
