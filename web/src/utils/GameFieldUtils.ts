import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { Letter, CellInput } from "../generated/graphql";
import styles from "../components/styles/gameField.module.scss";
export type PhaseState = {
  phase: string;
  cell: CellInput | null;
};
/**
 * Type for socket.io instance
*/
export type SocketState = Socket<DefaultEventsMap, DefaultEventsMap> | null;
/**
 * Converts Letter object to CellInput GQL type
 * @param letter Letter object
 * @returns CellInput object
 */
export const convertLetterToCellInput = (letter: Letter): CellInput => {
  const { boxNumber, char, filled, isNew } = letter;
  let cell: CellInput = { boxNumber, char, filled, isNew };
  return cell;
};

export const insertionPhaseCheck = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  chosenCell: CellInput,
  togglePhase: Function,
  phaseState: PhaseState
) => {

  if (chosenCell.filled) {
    return;
  }
  if (phaseState.cell === null) {
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
};

/**
 * Checking -> Adding cell to wordState  
 * @param e Event
 * @param chosenCell Cell 
 * @param updateWordState Function, that updates word state 
 * @param wordState Word state  
 */
export const selectionPhaseCheck = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  chosenCell: CellInput,
  updateWordState: Function,
  wordState: CellInput[]
) => {
  // We can put only elements with char in letterState
  if (!chosenCell.char) {
    return;
  }

  // We can safely put cell in letterState if it has no elements in it yet.
  const cellStyling = chosenCell.isNew
    ? styles.previewCellChosen
    : styles.cellActive;

  if (wordState.length === 0) {
    updateWordState([...wordState, chosenCell]);
    e.currentTarget.classList.add(cellStyling);
    return;
  }

  // Allowed values of difference between previous element index and new element index

  // Trying to find element in state to remove
  if (wordState.find((i) => i.boxNumber === chosenCell.boxNumber)) {
    // Element can only be removed if it is last element in array
    if (
      wordState.findIndex((i) => i.boxNumber === chosenCell.boxNumber) ===
      wordState.length - 1
    ) {      
      // Removing last element from array
      wordState.pop();
      updateWordState([...wordState]);      
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
        chosenCell.boxNumber - wordState[wordState.length - 1].boxNumber
      )
    ) !== -1
  ) {    
    // Value can be inserted
    updateWordState([...wordState, chosenCell]);
    e.currentTarget.classList.add(cellStyling);
  }
};
