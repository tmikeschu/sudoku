import { setup } from "xstate";
import { generateSudoku } from "./board";
import { Coordinate, Board } from "./types";

export const sudokuMachine = setup({
  types: {
    context: {} as {
      board: Board;
      guesses: Map<Coordinate, number>;
    },
  },
}).createMachine({
  context: {
    board: generateSudoku("hard"),
    guesses: new Map(),
  },
});
