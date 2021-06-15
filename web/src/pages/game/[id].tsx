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
  useCreateInvitationMutation,
  useMakeConfirmedTurnMutation,
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

  const [createInvitation] = useCreateInvitationMutation();
  const [tokenUrl, updateUrl] = useState("");
  const [makeConfirmedTurn] = useMakeConfirmedTurnMutation();
  if (!socket) {
    setSocket(socketIOClient("localhost:4000"));
  }
  /**
   * "insertion" phase - can choose only one cell and enter the letter with a keyboard
   * "selection" phase - can't insert values, can only select filled cells (and new one too)
   */
  const [phaseState, togglePhase] = useState(phaseInitialState);

  useEffect(() => {
    if (socket) {
      console.log(socket!.id);
      socket.on("askWordConfirmation", (data) => {
        const { word, gameId, stringWord } = data;
        if (
          confirm(
            `Ваш оппонент хочет использовать слово ${data.stringWord}, которого нет в словаре. Разрешить?`
          )
        ) {
          socket.emit("turnConfirmed", { word, gameId, stringWord });
        } else {
          console.log(`not confirmed`);
        }
      });
      socket.once("yourWordConfirmed", async (gameData) => {
        console.log(`yourwordconfirmed event`);
        const { word, gameId, stringWord } = gameData;
        await makeConfirmedTurn({
          variables: {
            gameId,
            word,
            stringWord,
          },
        });
        refetch();
        updateWordState([]);
        socket.emit("fieldUpdated", gameId);
      });
    }
  }, []);
  let playernames: string[] = [];
  let getGame = data?.getGame;
  getGame?.players?.map((i) => playernames.push(i.username));
  const isMyTurn =
    getGame?.currentTurn ===
    getGame?.players?.findIndex((i) => i.id === meData.data!.me!.id);

  const turnUsername = playernames[getGame?.currentTurn!];

  // Fetching
  if (loading || !meData || !data) {
    let _letters: Letter[] = new Array(25);
    for (let i = 0; i < 25; i++) {
      _letters.push({
        boxNumber: i,
        char: "",
        filled: false,
        id: i,
        isNew: false,
      });
    }
    if (networkStatus !== NetworkStatus.refetch) {
      /** Fake game field on first loading. Re-rendering only gamefield */
      return (
        <Layout>
          <GameField letters={[]} handleField={() => {}} />
          <Keyboard
            username={"..."}
            turn={false}
            handleFunction={() => {}}
            resetFunction={() => {}}
            sendFunction={() => {}}
          />
          <div className={styles.playerTableWrap}>
            <PlayerTable
              points={0}
              currentTurn={true}
              username={"Player 1"}
              wordList={null}
            />
            <PlayerTable
              points={0}
              currentTurn={false}
              username={"Player 2"}
              wordList={null}
            />
          </div>
        </Layout>
      );
    }
    return (
      /** Smooth loading while refetching */
      <Layout>
        <GameField letters={[]} handleField={() => {}} />
        <Keyboard
          username={turnUsername}
          turn={isMyTurn}
          handleFunction={() => {}}
          resetFunction={() => {}}
          sendFunction={() => {}}
        />
        <div className={styles.playerTableWrap}>
          <PlayerTable
            points={data?.getGame?.scoreP1 ?? 0}
            currentTurn={data?.getGame?.currentTurn === 0 ? true : false}
            username={playernames[0]}
            wordList={data?.getGame?.p1wordlist ?? null}
          />
          <PlayerTable
            points={data?.getGame?.scoreP2 ?? 0}
            currentTurn={data?.getGame?.currentTurn === 1 ? true : false}
            username={playernames[1]}
            wordList={data?.getGame?.p2wordlist ?? null}
          />
        </div>
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
  if (tokenUrl === "" && data) {
    createInvitation({
      variables: {
        gameId: data.getGame.id,
      },
    }).then((res) =>
      updateUrl(
        `localhost:3000/game/join-game/${res.data?.createInvitation as string}`
      )
    );
  }

  // Deep cloning because apollo hook response is R/O
  if (letters.length === 0 || networkStatus === NetworkStatus.refetch) {
    updateLetters(_.cloneDeep(data.getGame.gameField.letters));
  }

  // Connecting to socket.io room
  if (!roomConnection && socket) {
    console.log(`connecting to room ${data.getGame!.id}`);
    socket.emit("connectionToRoom", data.getGame!.id);
    connectToRoom(true);
  }

  // Listening to socket
  if (socket) { 
    // When a new player joins the game
    socket.on("playerJoined", (socketId) => {
      console.log(`player: socketId: ${socketId}`);
    });
    // When turn is made, game updates
    socket.on("updateGame", () => {
      togglePhase({
        cell: null,
        phase: "insertion",
      });      
      refetch().then((res) => {
        updateLetters(
          _.cloneDeep(res.data.getGame?.gameField.letters) as Letter[]
        );        
      });
    });
  }

  const game = data.getGame;

  /**
   * Making a turn with pre-checking
   * */
  const sendTurn = async () => {
    const some = wordState.some((i) => i.isNew === true);
    if (some) {
      try {
        await makeTurn({
          variables: {
            gameId: game.id,
            confirmed: false,
            word: wordState as CellInput[],
            socketId: socket!.id,
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

  /**
   * Handling new cell insertion on insertion phase
   * @param char selected character on keyboard
   */
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

  /**
   * Resets game field insertions and selections (refetches)
   */
  const resetInsertion = () => {
    updateLetters(_.cloneDeep(data.getGame!.gameField.letters));
    togglePhase({
      cell: null,
      phase: "insertion",
    });
    updateWordState([]);
    refetch();
  };

  /**
   * Handles selection or insertion on field
   * @param e event
   * @param chosenCell
   */
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
      {playernames.length < 2 &&
      data.getGame.players![0].id === meData.data?.me?.id ? (
        <div className={styles.tokenWrap}>
          <Text className={styles.invitationText}>
            Отправьте эту ссылку другу, чтобы пригласить его в игру.
          </Text>
          <input
            onClick={(e) => {
              e.currentTarget.select();
              document.execCommand("copy");
              console.log(`copying`);
            }}
            className={styles.tokenUrlInput}
            defaultValue={tokenUrl}
          />
        </div>
      ) : null}{" "}
      <Keyboard
        username={turnUsername}
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
