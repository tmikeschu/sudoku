import {
  setup,
  assign,
  type SnapshotFrom,
  ActorRefFrom,
  sendParent,
} from "xstate";
import { Difficulty, generateSudoku } from "./board";
import type { Coordinate, Board } from "../types";

type Input = {
  difficulty?: Difficulty;
};

type Action =
  | { type: "fill_number.click"; number: number }
  | { type: "cell.click"; coordinate: Coordinate }
  | { type: "reveal" }
  | { type: "cancel" }
  | { type: "confirm" };

export type Context = {
  board: Board;
  guesses: Map<Coordinate, number>;
  fillNumber?: number;
  fillCoordinate?: Coordinate;
};

export const gameMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Action,
    input: {} as Input | undefined,
  },
  actions: {
    setFillNumber: assign({
      fillNumber: (_, params: { number: number }) => {
        return params.number;
      },
    }),
    clearFillNumber: assign({ fillNumber: undefined }),
    setFillCoordinate: assign({
      fillCoordinate: (_, params: { coordinate: Coordinate }) => {
        return params.coordinate;
      },
    }),
    clearFillCoordinate: assign({ fillCoordinate: undefined }),
    handleCellClick: assign({
      guesses: ({ context }, params: { coordinate: Coordinate }) => {
        const { board, guesses, fillNumber } = context;
        const { coordinate } = params;

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
      guesses: (
        { context },
        params: { coordinate?: Coordinate; fillNumber?: number }
      ) => {
        const { coordinate, fillNumber } = params;

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
    revealPuzzle: assign({
      guesses: ({ context }) => {
        const originals = [...context.board.entries()].map(
          ([coord, cell]) =>
            [coord, cell.meta?.original] as [Coordinate, number]
        );
        return new Map(originals);
      },
    }),
  },
  guards: {
    clickedExistingFillNumber: ({ context }, params: { number: number }) => {
      return context.fillNumber === params.number;
    },
    clickedCurrentFillCoordinate: (
      { context },
      params: { coordinate: Coordinate }
    ) => {
      return context.fillCoordinate === params.coordinate;
    },
  },
}).createMachine({
  context: ({ input }) => ({
    board: generateSudoku(input.difficulty ?? "easy"),
    guesses: new Map(),
    fillNumber: undefined,
    fillCoordinate: undefined,
  }),
  on: {
    reveal: ".confirmReveal",
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        "fill_number.click": {
          target: "fill",
          actions: {
            type: "setFillNumber",
            params: ({ event }) => ({ number: event.number }),
          },
        },
        "cell.click": {
          target: "coordinate",
          actions: {
            type: "setFillCoordinate",
            params: ({ event: { coordinate } }) => ({ coordinate }),
          },
        },
      },
    },
    fill: {
      on: {
        "fill_number.click": [
          {
            target: "idle",
            actions: "clearFillNumber",
            guard: {
              type: "clickedExistingFillNumber",
              params: ({ event: { number } }) => ({ number }),
            },
          },
          {
            actions: {
              type: "setFillNumber",
              params: ({ event: { number } }) => ({ number }),
            },
          },
        ],
        "cell.click": {
          actions: {
            type: "setGuess",
            params: ({ context: { fillNumber }, event: { coordinate } }) => ({
              coordinate,
              fillNumber,
            }),
          },
        },
      },
    },
    coordinate: {
      on: {
        "fill_number.click": {
          actions: {
            type: "setGuess",
            params: ({
              context: { fillCoordinate: coordinate },
              event: { number: fillNumber },
            }) => ({ coordinate, fillNumber }),
          },
        },
        "cell.click": [
          {
            target: "idle",
            guard: {
              type: "clickedCurrentFillCoordinate",
              params: ({ event: { coordinate } }) => ({ coordinate }),
            },
          },
          {
            actions: {
              type: "setFillCoordinate",
              params: ({ event: { coordinate } }) => ({ coordinate }),
            },
          },
        ],
      },
    },
    confirmReveal: {
      on: {
        cancel: "idle",
        confirm: {
          target: "gameOver",
          actions: ["revealPuzzle", sendParent({ type: "gameOver" })],
        },
      },
    },
    gameOver: {
      type: "final",
    },
  },
});

export type GameSnapshot = SnapshotFrom<typeof gameMachine>;
export type GameActorRef = ActorRefFrom<typeof gameMachine>;
