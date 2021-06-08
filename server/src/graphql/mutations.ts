export const MAKE_TURN = `
mutation MakeTurn($confirmed: Boolean, $word: [CellInput!]!, $gameId: Float!) {
    makeTurn(confirmed: $confirmed, word: $word, gameId: $gameId) {
      ...GameFragment
    }
  }
  `;
