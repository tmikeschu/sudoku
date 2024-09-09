import { GameSnapshot } from "./gameMachine";
import { Row, Column, Coordinate, Board, Cell } from "../types";

export type Square = [Coordinate[], Coordinate[], Coordinate[]];

export const SQUARES: Square[] = [
  [
    ["1,1", "1,2", "1,3"],
    ["2,1", "2,2", "2,3"],
    ["3,1", "3,2", "3,3"],
  ],
  [
    ["1,4", "1,5", "1,6"],
    ["2,4", "2,5", "2,6"],
    ["3,4", "3,5", "3,6"],
  ],
  [
    ["1,7", "1,8", "1,9"],
    ["2,7", "2,8", "2,9"],
    ["3,7", "3,8", "3,9"],
  ],
  [
    ["4,1", "4,2", "4,3"],
    ["5,1", "5,2", "5,3"],
    ["6,1", "6,2", "6,3"],
  ],
  [
    ["4,4", "4,5", "4,6"],
    ["5,4", "5,5", "5,6"],
    ["6,4", "6,5", "6,6"],
  ],
  [
    ["4,7", "4,8", "4,9"],
    ["5,7", "5,8", "5,9"],
    ["6,7", "6,8", "6,9"],
  ],
  [
    ["7,1", "7,2", "7,3"],
    ["8,1", "8,2", "8,3"],
    ["9,1", "9,2", "9,3"],
  ],
  [
    ["7,4", "7,5", "7,6"],
    ["8,4", "8,5", "8,6"],
    ["9,4", "9,5", "9,6"],
  ],
  [
    ["7,7", "7,8", "7,9"],
    ["8,7", "8,8", "8,9"],
    ["9,7", "9,8", "9,9"],
  ],
];

export const COORDINATES: Coordinate[] = Object.values(SQUARES).flat(2).sort();

export const parseCoordinate = (raw: string): [Row, Column] => {
  return raw.split(",").map(Number) as [Row, Column];
};

export const ROWS = COORDINATES.reduce((acc, coord) => {
  const [row] = parseCoordinate(coord);
  if (!acc.has(row)) {
    acc.set(row, []);
  }
  acc.get(row)?.push(coord);
  return acc;
}, new Map() as Map<Row, Coordinate[]>);

export const COLUMNS = COORDINATES.reduce((acc, coord) => {
  const [, col] = parseCoordinate(coord);
  if (!acc.has(col)) {
    acc.set(col, []);
  }
  acc.get(col)?.push(coord);
  return acc;
}, new Map() as Map<Column, Coordinate[]>);

const SQUARE_MAP = SQUARES.reduce((acc, value, key) => {
  for (const cell of value.flat()) {
    acc.set(cell, key);
  }
  return acc;
}, new Map() as Map<Coordinate, number>);

function getPeerCoordinates(coordinate: Coordinate): Coordinate[] {
  const square = SQUARE_MAP.get(coordinate);
  if (square == null) return [];

  const [row, col] = parseCoordinate(coordinate);
  const peers = new Set([
    ...(ROWS.get(row) ?? []),
    ...(COLUMNS.get(col) ?? []),
    ...SQUARES[square].flat(),
  ]);

  return [...peers].filter((coord) => coord !== coordinate);
}

function getPeers(
  board: Board,
  coordinate: Coordinate,
  guesses?: Map<Coordinate, number>
): { coordinate: Coordinate; value: number }[] {
  const peers = getPeerCoordinates(coordinate);

  return [
    ...new Set(
      [...peers].map((c) => ({
        coordinate: c,
        value: guesses?.get(c) ?? board.get(c)?.value,
      }))
    ),
  ].filter(
    (x): x is { coordinate: Coordinate; value: number } =>
      typeof x.value === "number"
  );
}

function getPeerValues(
  board: Board,
  coordinate: Coordinate,
  guesses?: Map<Coordinate, number>
): number[] {
  return getPeers(board, coordinate, guesses).map(({ value }) => value);
}

function isValidCoordinate(coordinate: Coordinate): boolean {
  const square = SQUARE_MAP.get(coordinate);
  return square != null;
}

function isValid(board: Board, coordinate: Coordinate, num: number): boolean {
  if (!isValidCoordinate(coordinate)) return false;

  const peerValues = getPeerValues(board, coordinate);
  return !peerValues.includes(num);
}

// TODO current alg has boards with multiple solutions
function fillBoard(board: Board): Board {
  const copy = new Map(JSON.parse(JSON.stringify([...board]))) as Board;

  for (const coord of COORDINATES) {
    const peerValues = getPeerValues(board, coord);
    const randomNums = Array.from({ length: 9 }, (_, k) => k + 1)
      .filter((x) => !peerValues.includes(x))
      .sort(() => Math.random() - 0.5);

    for (const num of randomNums) {
      if (isValid(copy, coord, num)) {
        copy.set(coord, {
          value: num,
          meta: { original: num },
        });
        break;
      }
    }
    if (isGuessable(copy.get(coord))) {
      return fillBoard(board);
    }
  }

  return copy;
}

function generateCompleteBoard(): Board {
  const board: Board = COORDINATES.reduce((acc, coordinate) => {
    acc.set(coordinate, { value: 0 });
    return acc;
  }, new Map() as Board);

  return fillBoard(board);
}

function removeNumbers(board: Board, numHoles: number): Board {
  let holes = 0;
  while (holes < numHoles) {
    const coordinate =
      COORDINATES[Math.floor(Math.random() * COORDINATES.length)];
    const cell = board.get(coordinate);
    if (cell && cell.value !== 0) {
      board.set(coordinate, { ...cell, value: 0 });
      holes++;
    }
  }
  return board;
}

export type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_LEVELS: Record<Difficulty, number> = {
  easy: 40,
  medium: 50,
  hard: 60,
};

export function generateSudoku(difficulty: Difficulty): Board {
  const board = generateCompleteBoard();
  const puzzle = removeNumbers(board, DIFFICULTY_LEVELS[difficulty]);
  return puzzle;
}

export function isGuessable(cell?: Cell) {
  return cell?.value === 0;
}

export function getInvalidCoordinates(snapshot: GameSnapshot): Set<Coordinate> {
  const { board, guesses } = snapshot.context;

  const peerMap = [...guesses.entries()].reduce((acc, [coord]) => {
    acc[coord] = getPeers(board, coord, guesses);
    return acc;
  }, {} as Record<Coordinate, { coordinate: Coordinate; value: number }[]>);

  return new Set(
    [...guesses.entries()]
      .filter(([coord, guess]) => {
        const cell = board.get(coord);
        if (!cell) return false;
        return peerMap[coord].map(({ value }) => value).includes(guess);
      })
      .flatMap(([coord, guess]) => [
        coord,
        ...peerMap[coord]
          .filter((x) => x.value === guess)
          .map((x) => x.coordinate),
      ])
  );
}

export const getBoardValueString = (board: Board): string => {
  return [...board.values()].map((cell) => cell.value).join("");
};

export const getBoardSolutionString = (board: Board): string => {
  return [...board.values()].map((cell) => cell.meta?.original).join("");
};

export const isNumberComplete = ({
  board,
  guesses,
  number,
}: {
  board: Board;
  guesses: Map<Coordinate, number>;
  number: number;
}): boolean => {
  return SQUARES.every((square) => {
    const values = square.flat().map((coord) => {
      const cell = board.get(coord);
      return isGuessable(cell) ? guesses.get(coord) : cell?.meta?.original;
    });
    return values.includes(number);
  });
};
