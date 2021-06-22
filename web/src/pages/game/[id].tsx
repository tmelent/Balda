import { NetworkStatus } from "@apollo/client";
import _ from "lodash";
import { useRouter } from "next/router";
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
import { useIsAuth } from "src/utils/useIsAuth";
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
  // Fetching the game
  const router = useRouter();

  const { data, loading, refetch, networkStatus } = useGetGameFromUrl();
  // Fetching user data
  const meData = useMeQuery({ skip: isServer() });
  // Calling make turn resolver function
  const [makeTurn] = useMakeTurnMutation();
  // Control current game field state
  const [letters, updateLetters] = useState(lettersInitial);
  // Current word-creating state
  const [wordState, updateWordState] = useState(wordInitialState);
  // Connecting to socket.io room
  const [roomConnection, connectToRoom] = useState(false);
  // Socket IO connection
  const [socket, setSocket] = useState<SocketState>(initialSocketState);
  // Create invitation link
  const [createInvitation] = useCreateInvitationMutation();
  // Token URL
  const [tokenUrl, updateUrl] = useState("");
  // Faster making turn because of no need for check everything
  const [makeConfirmedTurn] = useMakeConfirmedTurnMutation();
  // Is currently waiting for confirmation?
  const [isWaitingForConfirmation, waitForConfirmation] = useState(false);
  // Turn phase: insertion | selection
  const [phaseState, togglePhase] = useState(phaseInitialState);
  useIsAuth();

  if (!socket) {
    setSocket(
      socketIOClient("https://api1.balda.tk", {
        withCredentials: true,
        extraHeaders: {
          "my-custom-header": "sio",
        },
      })
    );
  }
  useEffect(() => {
    // Setting up Socket connection
    if (socket) {
      // If your opponent needs your approval
      socket.on("askWordConfirmation", (data) => {
        const { word, gameId, stringWord } = data;
        if (
          confirm(
            `Ваш оппонент хочет использовать слово "${data.stringWord}", которого нет в словаре. Разрешить?`
          )
        ) {
          socket!.emit("turnConfirmed", { word, gameId, stringWord });
        }
        socket!.emit("turnRejected", gameId);
      });

      // If your word has been rejected by your opponent
      socket.on("yourWordRejected", () => {
        waitForConfirmation(false);
        updateWordState([]);
        refetch();
      });
      // If your opponent has approved your word
      socket.on("yourWordConfirmed", async (gameData) => {
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
        waitForConfirmation(false);
      });
    }
  }, []);

  // Extracting info from data
  let playernames: string[] = [];
  let getGame = data?.getGame;
  getGame?.players?.map((i) => playernames.push(i.username));
  const isMyTurn =
    getGame?.currentTurn ===
    getGame?.players?.findIndex((i) => i.id === meData.data!.me!.id);
  const turnUsername = playernames[getGame?.currentTurn!];

  // When loading or refetching -- keep page filled with some content
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
            waitingState={true}
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
          waitingState={true}
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
        `${process.env.THIS_DOMAIN}/game/join-game/${res.data?.createInvitation}`
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
  if (socket) {
    socket.on("playerJoined", (socketId) => {
      if (data.getGame?.players?.length === 1) {
        router.reload();
      }
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
        socket!.emit("fieldUpdated", data.getGame!.id);
      } catch (e) {
        console.error(e.message);
        if (e.message.includes("confirmation")) {
          waitForConfirmation(true);
        }
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
    // Player can only do something if it's his turn or he is not waiting for word confirmation.
    if (!isMyTurn || isWaitingForConfirmation) {
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
        waitingState={isWaitingForConfirmation}
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
