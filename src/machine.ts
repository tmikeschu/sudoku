import { setup, assign, type SnapshotFrom } from "xstate";
import { generateSudoku } from "./board";
import type { Coordinate, Board } from "./types";

type Action =
  | { type: "CLICK_FILL_NUMBER"; number: number }
  | { type: "CLICK_CELL"; coordinate: Coordinate };

export type Context = {
  board: Board;
  guesses: Map<Coordinate, number>;
  fillNumber?: number;
  fillCoordinate?: Coordinate;
};

export const sudokuMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Action,
  },
  actions: {
    setFillNumber: assign({
      fillNumber: ({ context, event }) => {
        if (event.type !== "CLICK_FILL_NUMBER") return context.fillNumber;
        return event.number;
      },
    }),
    clearFillNumber: assign({ fillNumber: undefined }),
    setFillCoordinate: assign({
      fillCoordinate: ({ context, event }) => {
        if (event.type !== "CLICK_CELL") return context.fillCoordinate;
        return event.coordinate;
      },
    }),
    clearFillCoordinate: assign({ fillCoordinate: undefined }),
    handleCellClick: assign({
      guesses: ({ context, event }) => {
        if (event.type !== "CLICK_CELL") return context.guesses;

        const { board, guesses, fillNumber } = context;
        const { coordinate } = event;

        if (board.get(coordinate)?.value !== 0) return context.guesses;

        const draft = new Map(guesses);
        const guess = guesses.get(coordinate);

        if (!guess && fillNumber) {
          draft.set(coordinate, fillNumber);
          return draft;
        }

        if (guess === fillNumber) {
          draft.delete(coordinate);
          return draft;
        }

        return context.guesses;
      },
    }),
    setGuess: assign({
      guesses: ({ context, event }) => {
        const { coordinate, fillNumber } =
          event.type === "CLICK_CELL"
            ? { coordinate: event.coordinate, fillNumber: context.fillNumber }
            : { coordinate: context.fillCoordinate, fillNumber: event.number };

        if (!coordinate || !fillNumber) return context.guesses;

        const { board } = context;

        if (!coordinate || board.get(coordinate)?.value !== 0)
          return context.guesses;

        const draft = new Map(context.guesses);
        const guess = draft.get(coordinate);

        if (guess === fillNumber) {
          draft.delete(coordinate);
          return draft;
        }

        draft.set(coordinate, fillNumber);
        return draft;
      },
    }),
  },
  guards: {
    clickedExistingFillNumber: ({ context, event }) => {
      if (event.type !== "CLICK_FILL_NUMBER") return false;
      return context.fillNumber === event.number;
    },
    clickedCurrentFillCoordinate: ({ context, event }) => {
      if (event.type !== "CLICK_CELL") return false;
      return context.fillCoordinate === event.coordinate;
    },
  },
}).createMachine({
  context: {
    board: generateSudoku("medium"),
    guesses: new Map(),
    fillNumber: undefined,
  },
  on: {},
  initial: "idle",
  states: {
    idle: {
      on: {
        CLICK_FILL_NUMBER: { target: "fill", actions: "setFillNumber" },
        CLICK_CELL: { target: "coordinate", actions: "setFillCoordinate" },
      },
    },
    fill: {
      on: {
        CLICK_FILL_NUMBER: [
          {
            target: "idle",
            actions: "clearFillNumber",
            guard: "clickedExistingFillNumber",
          },
          { actions: "setFillNumber" },
        ],
        CLICK_CELL: { actions: "setGuess" },
      },
    },
    coordinate: {
      on: {
        CLICK_FILL_NUMBER: { actions: "setGuess" },
        CLICK_CELL: [
          { target: "idle", guard: "clickedCurrentFillCoordinate" },
          { actions: "setFillCoordinate" },
        ],
      },
    },
  },
});

export type SudokuSnapshot = SnapshotFrom<typeof sudokuMachine>;
