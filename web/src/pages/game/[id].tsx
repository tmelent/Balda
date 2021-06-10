import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import { PlayerTable } from "src/components/game/PlayerTable";
import {
  CellInput,
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
import Router from "next/router";
import { Keyboard } from "../../components/keyboard/Keyboard";

const Game = ({}) => {
  // Initial states and typings
  type PhaseState = {
    phase: string;
    cell: CellInput | null;
  };
  let letterInitialState: CellInput[] = [];
  let phaseInitialState: PhaseState = {
    cell: null,
    phase: "insertion",
  };

  // Hooks
  const [meData] = useMeQuery({ pause: isServer() });
  const [, makeTurn] = useMakeTurnMutation();
  const [{ data, fetching }] = useGetGameFromUrl();

  const [letterState, updateState] = useState(letterInitialState);
  /**
   * "insertion" phase - can choose only one cell and enter the letter with a keyboard
   * "selection" phase - can't insert values, can only select filled cells (and new one too)
   */
  const [phaseState, togglePhase] = useState(phaseInitialState);

  useEffect(() => {
    const socket = socketIOClient("localhost:4000");
    socket.on("playerConnected", (data) => {
      console.log(`player ${data} connected`);
    });
    socket.on("confirmationRequired", (data) => {
      alert(`allow ${data.word}?`);
    });
  }, []);

  // Fetching
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

  let letters = data.getGame.gameField.letters;
  const game = data.getGame;
  let playernames: string[] = [];
  data.getGame.players?.map((i) => playernames.push(i.username));

  const sendTurn = async () => {
    console.log(`in send turn method`);
    console.log(`trying to make turn with word:`);
    letterState.map((i) => console.log(i));
    const some = letterState.some((i) => i.isNew === true);
    console.log(some);
    if (some) {
      await makeTurn({
        gameId: 1,
        confirmed: false,
        word: letterState as CellInput[],
      });
      return;
    }
  };

  const convertLetterToCellInput = (letter: Letter): CellInput => {
    const { boxNumber, char, filled, isNew } = letter;
    let cell: CellInput = { boxNumber, char, filled, isNew };
    return cell;
  };

  const isMyTurn =
    game.currentTurn ===
    data.getGame!.players?.findIndex((i) => i.id === meData.data!.me!.id);

  const handleInsertion = (char: string) => {
    if (phaseState.cell !== null && phaseState.phase === "insertion") {
      togglePhase({
        cell: { ...phaseState.cell, char },
        phase: "selection",
      });
      let currLetter = letters[phaseState.cell.boxNumber];
      letters[phaseState.cell.boxNumber] = {
        ...currLetter,
        char: char,
        filled: true,
        isNew: true,
      };
    }
  };

  const resetInsertion = () => {
    letters = data.getGame!.gameField.letters;    
    togglePhase({
      cell: null,
      phase: "insertion",
    });
    Router.router?.reload();
  };
  const handleField = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chosenCell: CellInput
  ) => {
    console.log(chosenCell);
    // Player can only do something if it's his turn.
    if (!isMyTurn) {
      return;
    }

    // --- Phase 1 ---
    // Insertion phase
    // ---------------

    if (phaseState.phase === "insertion") {
      // Adding new cell
      if (chosenCell.filled){
        return;
      }
      if (phaseState.cell === null ) {
        togglePhase({
          cell: chosenCell,
          phase: "insertion",
        });
        // Styling
        e.currentTarget.classList.add(styles.previewCellActive);
        return;
      }

      // Removing cell if it matches a cell in phaseState
      if (phaseState.cell.boxNumber === chosenCell.boxNumber) {
        togglePhase({
          cell: null,
          phase: "insertion",
        });
        // Styling
        e.currentTarget.classList.remove(styles.previewCellActive);
        return;
      }
      return;
    }

    // --- Phase 2 ---
    // Selection phase
    // ---------------

    // We can put only elements with char in letterState
    if (!chosenCell.char) {
      return;
    }

    // We can safely put cell in letterState if it has no elements in it yet.
    const cellStyling = chosenCell.isNew
      ? styles.previewCellChosen
      : styles.cellActive;
    console.log(`cell is ${chosenCell.isNew}`);
    console.log(cellStyling);
    if (letterState.length === 0) {
      console.log(`length: 0`);
      updateState([...letterState, chosenCell]);
      e.currentTarget.classList.add(cellStyling);
      return;
    }

    // Allowed values of difference between previous element index and new element index

    // Trying to find element in state to remove
    if (letterState.find((i) => i.boxNumber === chosenCell.boxNumber)) {
      // Element can only be removed if it is last element in array
      if (
        letterState.findIndex((i) => i.boxNumber === chosenCell.boxNumber) ===
        letterState.length - 1
      ) {
        console.log(`removing`);
        // Removing last element from array
        letterState.pop();
        updateState([...letterState]);
        console.log(e.currentTarget.classList);
        e.currentTarget.classList.remove(cellStyling);
        return;
      }
      return;
    }
    // Checking if player can use this cell via comparing indexes
    // |prevElementIdx - newElementIdx| === 5 || 1
    let allowedDiff = [5, 1];
    if (
      allowedDiff.indexOf(
        Math.abs(
          chosenCell.boxNumber - letterState[letterState.length - 1].boxNumber
        )
      ) !== -1
    ) {
      console.log(`inserting`);
      // Value can be inserted
      updateState([...letterState, chosenCell]);
      e.currentTarget.classList.add(cellStyling);
    }
  };

  // Splitting letters in columns and rows
  var rows = [];
  for (var i = 0; i < letters.length; i += 5) {
    rows.push(letters.slice(i, 5 + i));
  }

  return (
    <Layout>
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

      <Keyboard
        turn={isMyTurn}
        handleFunction={handleInsertion}
        resetFunction={resetInsertion}
        sendFunction={sendTurn}
      />
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
