import { fiveLetters } from "../dictionary/dictionary";

export default async function generateRandomWord() {
  return fiveLetters[Math.floor(Math.random() * fiveLetters.length)];
}
