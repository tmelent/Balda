import { withUrqlClient } from "next-urql";
import * as React from "react";
import { createUrqlClient } from "src/utils/createUrqlClient";
import { Flex } from "../basic/Flex";
import styles from "../styles/keyboard.module.scss";
import utilStyles from "../styles/utility.module.scss";
interface KeyboardProps {
  turn: boolean;
  handleFunction: Function;
  resetFunction: Function;
  sendFunction: Function;
}
export const Keyboard: React.FC<KeyboardProps> = ({
  turn,
  handleFunction,
  resetFunction,
  sendFunction,
}) => {
  // Cyrillic alphabet
  // Note: ё === е, и === й
  const keys = [
    "й",
    "ц",
    "у",
    "к",
    "е",
    "н",
    "г",
    "ш",
    "щ",
    "з",
    "х",
    "ъ",
    "ф",
    "ы",
    "в",
    "а",
    "п",
    "р",
    "о",
    "л",
    "д",
    "ж",
    "э",
    "я",
    "ч",
    "с",
    "м",
    "и",
    "т",
    "ь",
    "б",
    "ю",
  ];

  const handleClick = (key: string) => {
    console.log(`${key} pressed. Handling...`);
    handleFunction(key);
  };

  var rows = [];
  rows.push(keys.slice(0, 12));
  rows.push(keys.slice(12, 23));
  rows.push(keys.slice(23));
  return (
    <div className={styles.keyboardWrap}>
      <Flex className={styles.buttonsWrap}>
        <div
          className={`${styles.submitBtn} ${utilStyles.unselectable}`}
          onClick={async () => await sendFunction()}
        >
          Отправить
        </div>

        <div
          className={`${styles.deleteBtn} ${utilStyles.unselectable} ${utilStyles.warningBtn}`}
          onClick={() => resetFunction()}
        >
          Очистить
        </div>
      </Flex>
      <div className={styles.keyboard} hidden={!turn}>
        {rows.map((row, i) => {
          return (
            <Flex className={`${styles.keyboardRow}`} key={`keyboardRow-${i}`}>
              {row.map((key, idx) => {
                return (
                  <div
                    className={`${styles.key} ${utilStyles.unselectable}`}
                    key={`key-${idx}`}
                    onClick={() => handleClick(key)}
                  >
                    {key.toUpperCase()}
                  </div>
                );
              })}
            </Flex>
          );
        })}
      </div>
    </div>
  );
};

export default withUrqlClient(createUrqlClient)(Keyboard as any);
