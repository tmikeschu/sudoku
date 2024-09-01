import { setup, assign } from "xstate";
import { generateSudoku } from "./board";
import { Coordinate, Board } from "./types";

type Action =
  | { type: "SET_CURRENT_NUMBER"; number: number }
  | { type: "CLICK_CELL"; coordinate: Coordinate };

type Context = {
  board: Board;
  guesses: Map<Coordinate, number>;
  currentNumber?: number;
};

export const sudokuMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Action,
  },
  actions: {
    setCurrentNumber: assign({
      currentNumber: ({ context, event }) => {
        if (event.type !== "SET_CURRENT_NUMBER") return context.currentNumber;

        return context.currentNumber === event.number
          ? undefined
          : event.number;
      },
    }),
    handleCellClick: assign({
      guesses: ({ context, event }) => {
        if (event.type !== "CLICK_CELL") return context.guesses;

        const { board, guesses, currentNumber } = context;
        const { coordinate } = event;

        if (board.get(coordinate)?.value !== 0) return context.guesses;

        const draft = new Map(guesses);
        const guess = guesses.get(coordinate);

        if (!guess && currentNumber) {
          draft.set(coordinate, currentNumber);
          return draft;
        }

        if (guess === currentNumber) {
          draft.delete(coordinate);
          return draft;
        }

        return context.guesses;
      },
    }),
  },
}).createMachine({
  context: {
    board: generateSudoku("medium"),
    guesses: new Map(),
    currentNumber: undefined,
  },
  on: {
    SET_CURRENT_NUMBER: { actions: ["setCurrentNumber"] },
    CLICK_CELL: { actions: ["handleCellClick"] },
  },
});
