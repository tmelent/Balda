import * as React from "react";
import { Flex } from "../basic/Flex";
import styles from "../styles/keyboard.module.scss";
import { Text } from "../basic/Text";
import utilStyles from "../styles/utility.module.scss";
interface KeyboardProps {
  username: string;
  turn: boolean;
  waitingState: boolean;
  handleFunction: Function;
  resetFunction: Function;
  sendFunction: Function;
}
export const Keyboard: React.FC<KeyboardProps> = ({
  username,
  turn,
  waitingState,
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
    handleFunction(key);
  };

  var rows: [string[]] = [[]];
  rows.push(keys.slice(0, 12));
  rows.push(keys.slice(12, 23));
  rows.push(keys.slice(23));
  return (
    <div className={styles.keyboardWrap}>
      <Flex className={styles.buttonsWrap}>
        <Text className={styles.turnText}>
          {turn ? `Ваш ход` : username ? `Сейчас ходит: ${username}` : `Играть одному скучно... пригласите друга!`}
        </Text>
        <div
          className={`${styles.submitBtn} ${utilStyles.unselectable}`}
          onClick={async () => {
            if (!waitingState) {
              await sendFunction();
            }
          }}
        >
          Отправить
        </div>

        <div
          className={`${styles.deleteBtn} ${utilStyles.unselectable} ${utilStyles.warningBtn}`}
          onClick={() => {
            if (!waitingState) {
              resetFunction();
            }
          }}
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
