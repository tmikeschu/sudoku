type Column = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";

type Square = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";

type Row = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type Cell = `${Column}${Row}`;

const SQUARES: Record<Square, Set<Cell>> = {
  A: new Set(["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]),
  B: new Set(["A4", "A5", "A6", "B4", "B5", "B6", "C4", "C5", "C6"]),
  C: new Set(["A7", "A8", "A9", "B7", "B8", "B9", "C7", "C8", "C9"]),
  D: new Set(["D1", "D2", "D3", "E1", "E2", "E3", "F1", "F2", "F3"]),
  E: new Set(["D4", "D5", "D6", "E4", "E5", "E6", "F4", "F5", "F6"]),
  F: new Set(["D7", "D8", "D9", "E7", "E8", "E9", "F7", "F8", "F9"]),
  G: new Set(["G1", "G2", "G3", "H1", "H2", "H3", "I1", "I2", "I3"]),
  H: new Set(["G4", "G5", "G6", "H4", "H5", "H6", "I4", "I5", "I6"]),
  I: new Set(["G7", "G8", "G9", "H7", "H8", "H9", "I7", "I8", "I9"]),
};

const CELLS: Cell[] = Object.values(SQUARES).flatMap((squares) =>
  Array.from(squares)
);

const ROWS = CELLS.reduce((acc, cell) => {
  const row = cell[1] as Row;
  acc[row] = acc[row] || [];
  acc[row].push(cell);
  return acc;
}, {} as Record<Row, Cell[]>);

const COLUMNS = CELLS.reduce((acc, cell) => {
  const col = cell[0] as Column;
  acc[col] = acc[col] || [];
  acc[col].push(cell);
  return acc;
}, {} as Record<Column, Cell[]>);

const SQUARE_MAP = Object.entries(SQUARES).reduce((acc, [key, value]) => {
  for (const cell of value) {
    acc[cell] = key as Square;
  }
  return acc;
}, {} as Record<Cell, Square>);

type CellValue =
  | { type: "base"; value: number }
  | { type: "guess"; value: number };
type Board = Record<Cell, CellValue>;

function isValid(board: Board, cell: Cell, num: number): boolean {
  const [col, row] = cell.split("") as [Column, Row];

  const peers = [...ROWS[row], ...COLUMNS[col], ...SQUARES[SQUARE_MAP[cell]]];
  const peerNums = peers.map((c) => board[c].value);

  if (peerNums.includes(num)) {
    return false;
  }

  return true;
}

function fillBoard(board: Board): boolean {
  for (const cell of CELLS) {
    if (board[cell].value === 0) {
      const randomNums = Array.from({ length: 9 }, (_, k) => k + 1).sort(
        () => Math.random() - 0.5
      );

      for (const num of randomNums) {
        if (isValid(board, cell, num)) {
          board[cell] = { type: "base", value: num };
          if (fillBoard(board)) {
            return true;
          }
          board[cell] = { type: "base", value: 0 };
        }
      }
      return false;
    }
  }
  return true;
}

function generateCompleteBoard(): Board {
  const board: Board = CELLS.reduce((acc, cell) => {
    acc[cell] = { type: "base", value: 0 };
    return acc;
  }, {} as Board);

  fillBoard(board);

  return board;
}

function removeNumbers(board: Board, numHoles: number): Board {
  let holes = 0;
  while (holes < numHoles) {
    const cell = CELLS[Math.floor(Math.random() * CELLS.length)];
    if (board[cell].value !== 0) {
      board[cell] = { type: "guess", value: 0 };
      holes++;
    }
  }
  return board;
}

type Difficulty = "easy" | "medium" | "hard";

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
