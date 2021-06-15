export const MAKE_CONFIRMED_TURN = `
mutation MakeConfirmedTurn($word: [CellInput!]!, $gameId: Float!, $stringWord: String!) {
    makeConfirmedTurn(confirmed: $confirmed, word: $word, gameId: $gameId, stringWord: $stringWord) {
      ...GameFragment
    }
  }
  `;
