import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { GameField } from "src/components/game/GameField";
import { PlayerTable } from "src/components/game/PlayerTable";
import {
  insertionPhaseCheck,
  PhaseState,
  selectionPhaseCheck,
  SocketState,
} from "src/utils/GameFieldUtils";
import { isServer } from "src/utils/isServer";
import { useGetGameFromUrl } from "src/utils/useGetGameFromUrl";
import { withApollo } from "src/utils/withApollo";
import { Layout } from "../../components/basic/Layout";
import { Text } from "../../components/basic/Text";
import { Keyboard } from "../../components/keyboard/Keyboard";
import styles from "../../components/styles/gameField.module.scss";
import {
  CellInput,
  Letter,
  useMakeTurnMutation,
  useMeQuery,
} from "../../generated/graphql";

import _ from "lodash";
import { NetworkStatus } from "@apollo/client";

const Game = ({}) => {
  // Initial states and typings
  let lettersInitial: Letter[] = [];
  let initialSocketState: SocketState = null;
  let wordInitialState: CellInput[] = [];
  let phaseInitialState: PhaseState = {
    cell: null,
    phase: "insertion",
  };

  // Hooks
  const { data, loading, refetch, networkStatus } = useGetGameFromUrl();
  const meData = useMeQuery({ skip: isServer() });
  const [makeTurn] = useMakeTurnMutation();
  const [letters, updateLetters] = useState(lettersInitial);
  const [wordState, updateWordState] = useState(wordInitialState);
  const [roomConnection, connectToRoom] = useState(false);
  const [socket, setSocket] = useState<SocketState>(initialSocketState);
  /**
   * "insertion" phase - can choose only one cell and enter the letter with a keyboard
   * "selection" phase - can't insert values, can only select filled cells (and new one too)
   */
  const [phaseState, togglePhase] = useState(phaseInitialState);
  useEffect(() => {
    setSocket(socketIOClient("localhost:4000"));
    return () => {
      if (socket) {
        socket.off();
      }
    };
  }, []);

  // Fetching
  if (loading) {
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

  if (letters.length === 0 || networkStatus === NetworkStatus.refetch) {
    updateLetters(_.cloneDeep(data.getGame.gameField.letters));
  }

  if (!roomConnection && socket) {
    console.log(`connecting to room ${data.getGame!.id}`);
    socket.emit("connectionToRoom", data.getGame!.id);
    connectToRoom(true);
  }

  if (socket) {
    socket.on("playerJoined", (socketId) => {
      console.log(`player: socketId: ${socketId}`);
    });
    socket.on("updateGame", () => {
      togglePhase({
        cell: null,
        phase: "insertion",
      });

      refetch().then((res) =>
        updateLetters(
          _.cloneDeep(res.data.getGame?.gameField.letters) as Letter[]
        )
      );
    });
  }

  const game = data.getGame;
  let playernames: string[] = [];
  data.getGame.players?.map((i) => playernames.push(i.username));

  const sendTurn = async () => {
    const some = wordState.some((i) => i.isNew === true);
    if (some) {
      try {
        await makeTurn({
          variables: {
            gameId: data.getGame!.id,
            confirmed: false,
            word: wordState as CellInput[],
          },
        });
        refetch();
        updateWordState([]);
        socket?.emit("fieldUpdated", data.getGame!.id);
      } catch (e) {
        console.error(e.message);
      }
      return;
    }
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
    updateLetters(_.cloneDeep(data.getGame!.gameField.letters));
    togglePhase({
      cell: null,
      phase: "insertion",
    });
    updateWordState([]);
    refetch();
  };
  const handleField = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chosenCell: CellInput
  ) => {
    // Player can only do something if it's his turn.
    if (!isMyTurn) {
      return;
    }

    // Insertion phase
    if (phaseState.phase === "insertion") {
      return insertionPhaseCheck(e, chosenCell, togglePhase, phaseState);
    }

    // Selection phase
    return selectionPhaseCheck(e, chosenCell, updateWordState, wordState);
  };

  return (
    <Layout>
      <GameField letters={letters} handleField={handleField} />
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
export default withApollo({ ssr: false })(Game);
