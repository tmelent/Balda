import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import { PlayerTable } from "src/components/game/PlayerTable";
import {
  Letter,
  useMakeTurnMutation,
  useMeQuery,
} from "../../generated/graphql";
import { useGetGameFromUrl } from "src/utils/useGetGameFromUrl";
import { Layout } from "../../components/basic/Layout";
import { Text } from "../../components/basic/Text";
import styles from "../../components/styles/gameField.module.scss";
import { createUrqlClient } from "../../utils/createUrqlClient";
import socketIOClient from "socket.io-client";
import { isServer } from "src/utils/isServer";
import { Button } from "src/components/basic/Button";
import { Keyboard } from "../../components/keyboard/Keyboard";

const Game = ({}) => {
  const [medata] = useMeQuery({ pause: isServer() });
  const [, makeTurn] = useMakeTurnMutation();
  const [{ data, fetching }] = useGetGameFromUrl();
  let letterarr: Letter[] = [];
  const [letterState, updateState] = useState(letterarr);
  const [turnState, setTurnState] = useState(false);

  useEffect(() => {
    const socket = socketIOClient("localhost:4000");
    socket.on("playerConnected", (data) => {
      console.log(`player ${data} connected`);
    });
    socket.on("confirmationRequired", (data) => {
      alert(`allow ${data.word}?`);
    });
  }, []);

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

  // Splitting letters in columns and rows
  // [{Letter0}, {Letter1} ... {Letter24}] ===> [[{Letter0}, {Letter1}...{Letter4}], [{Letter5}, {Letter6}...{Letter9}]...]
  const letters = data.getGame.gameField.letters;
  const game = data.getGame;
  let playernames: string[] = [];
  data.getGame.players?.map((i) => playernames.push(i.username));

  const sendTurn = async () => {
    await makeTurn({ gameId: 2, confirmed: false, word: letterState });
  };

  const isMyTurn =
    game.currentTurn !==
    data.getGame!.players?.findIndex((i) => i.id === medata.data!.me!.id);

  const handleField = (obj: Letter) => {
    // If it is not your turn.
    if (isMyTurn) {
      return;
    }

    if (letterState.length === 0) {
      console.log(obj);

      if (obj.filled) {
        console.log(`${obj.isNew} - is filled`);
        return;
      }
      // If there is no cell selected, it'll just add it to state
      updateState([...letterState, obj]);
      setTurnState(true);
      return;
    }

    // Allowed values of difference between previous element index and new element index
    let allowedDiff = [5, 1];

    // Trying to find element in state to remove
    if (letterState.find((i) => i.id === obj.id)) {
      // Element can only be removed if it is last element in array
      if (
        letterState.findIndex((i) => i.id === obj.id) ===
        letterState.length - 1
      ) {
        // Removing last element from array
        letterState.pop();
        updateState([...letterState]);
        return;
      }
      return;
    }
    // |prevElementIdx - newElementIdx| === 5 || 1
    if (
      allowedDiff.indexOf(
        Math.abs(obj.boxNumber - letterState[letterState.length - 1].boxNumber)
      ) !== -1
    ) {
      // Value can be inserted
      updateState([...letterState, obj]);
    }
  };

  var rows = [];
  for (var i = 0; i < letters.length; i += 5) {
    rows.push(letters.slice(i, 5 + i));
  }

  return (
    <Layout>
        <Keyboard turn={true}/>
      <div className={styles.gameFieldGrid}>
        {rows.map((row, i) => {
          return (
            <div className={styles.gameRow} key={`cells-row-${i}`}>
              {row.map((col) => (
                <div
                  className={`${styles.gameCell} ${
                    letterState.find((i) => i.id === col.id)
                      ? styles.cellActive
                      : ""
                  }`}
                  onClick={async () =>
                    handleField({
                      id: col.id,
                      char: col.char,
                      boxNumber: col.boxNumber,
                      filled: col.filled,
                      isNew: col.filled,
                    })
                  }
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
      <Button onClick={async () => await sendTurn()}>Отправить слово</Button>
      <div className={styles.playerTableWrap}>
        <PlayerTable
          points={game.scoreP1 ? game.scoreP1 : 0}
          currentTurn={game.currentTurn === 0 ? true : false}
          username={playernames[0]}
          wordList={game.p1wordlist ? game.p1wordlist : null}
        />
        <PlayerTable
          points={game.scoreP2 ? game.scoreP2 : 0}
          currentTurn={game.currentTurn === 1 ? true : false}
          username={playernames[1]}
          wordList={game.p2wordlist ? game.p2wordlist : null}
        />
      </div>
    
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient)(Game);
