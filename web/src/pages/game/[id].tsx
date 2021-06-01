import { withUrqlClient } from "next-urql";
import React from "react";
import { useGetGameFromUrl } from "src/utils/useGetGameFromUrl";
import { Layout } from "../../components/basic/Layout";
import { Text } from "../../components/basic/Text";
import styles from "../../components/styles/gameField.module.scss";
import { createUrqlClient } from "../../utils/createUrqlClient";

// Renders GameField by gameId (from url)

const Game = ({}) => {
  const [{ data, fetching }] = useGetGameFromUrl();

  if (fetching) {
    return (
      <Layout>
        <Text>Загрузка...</Text>
      </Layout>
    );
  }

  // Can't load game
  if (!data?.getGame) {
    return (
      <Layout>
        <Text>Невозможно загрузить игру.</Text>
      </Layout>
    );
  }

  // [{Letter0}, {Letter1} ... {Letter24}] ===> [[{Letter0}, {Letter1}...{Letter4}], [{Letter5}, {Letter6}...{Letter9}]...]
  const letters = data.getGame.gameField.letters;
  var rows = [];
  for (var i = 0; i < letters.length; i += 5) {
    rows.push(letters.slice(i, 5 + i));
  }

  return (
    <Layout>
      <div className={styles.gameFieldGrid}>
        {rows.map((row, i) => {
          console.log(row);
          return (
            <div className={styles.gameRow} key={`cells-row-${i}`}>
              {row.map((col) => (
                <div className={styles.gameCell} key={`cell-${col.boxNumber}`}>
                  {col.char === "" ? null : col.char.toUpperCase()}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient)(Game);
