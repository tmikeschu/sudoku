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
      fillNumber: (_, params: { number: number }) => params.number,
    }),
    clearFillNumber: assign({ fillNumber: undefined }),
    setFillCoordinate: assign({
      fillCoordinate: (_, params: { coordinate: Coordinate }) =>
        params.coordinate,
    }),
    clearFillCoordinate: assign({ fillCoordinate: undefined }),
    handleCellClick: assign({
      guesses: (
        _,
        params: { coordinate: Coordinate } & Pick<
          Context,
          "board" | "guesses" | "fillNumber"
        >
      ) => {
        const { coordinate, board, guesses, fillNumber } = params;

        if (board.get(coordinate)?.value !== 0) return guesses;

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

        return guesses;
      },
    }),
    setGuess: assign({
      guesses: (
        _,
        params: { coordinate?: Coordinate } & Pick<
          Context,
          "fillNumber" | "guesses" | "board"
        >
      ) => {
        const { coordinate, fillNumber, guesses, board } = params;

        if (!coordinate || !fillNumber) return guesses;

        if (!coordinate || board.get(coordinate)?.value !== 0) return guesses;

        const draft = new Map(guesses);
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
      guesses: (_, params: Pick<Context, "board">) => {
        const originals = [...params.board.entries()].map(
          ([coord, cell]) =>
            [coord, cell.meta?.original] as [Coordinate, number]
        );
        return new Map(originals);
      },
    }),
  },
  guards: {
    clickedExistingFillNumber: (
      _,
      params: { fillNumber?: number; number: number }
    ) => params.fillNumber === params.number,

    clickedCurrentFillCoordinate: (
      _,
      params: { coordinate: Coordinate; fillCoordinate?: Coordinate }
    ) => params.fillCoordinate === params.coordinate,

    puzzleIsComplete: (
      _,
      params: { board: Board; guesses: Map<Coordinate, number> }
    ) =>
      [...params.board.entries()].every(
        ([coord, cell]) => cell.value === params.guesses.get(coord)
      ),
  },
}).createMachine({
  context: ({ input }) => ({
    board: generateSudoku(input.difficulty ?? "easy"),
    guesses: new Map(),
    fillNumber: undefined,
    fillCoordinate: undefined,
  }),
  on: { reveal: ".confirmReveal" },
  initial: "idle",
  always: [
    {
      target: ".gameOver",
      guard: {
        type: "puzzleIsComplete",
        params: ({ context: { board, guesses } }) => ({ board, guesses }),
      },
    },
  ],
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
              params: ({ context: { fillNumber }, event: { number } }) => ({
                number,
                fillNumber,
              }),
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
            params: ({
              context: { fillNumber, board, guesses },
              event: { coordinate },
            }) => ({ coordinate, fillNumber, board, guesses }),
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
              context: { fillCoordinate: coordinate, board, guesses },
              event: { number: fillNumber },
            }) => ({ coordinate, fillNumber, board, guesses }),
          },
        },
        "cell.click": [
          {
            target: "idle",
            guard: {
              type: "clickedCurrentFillCoordinate",
              params: ({
                context: { fillCoordinate },
                event: { coordinate },
              }) => ({ coordinate, fillCoordinate }),
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
          actions: [
            {
              type: "revealPuzzle",
              params: ({ context: { board } }) => ({ board }),
            },
            sendParent({ type: "gameOver" }),
          ],
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
