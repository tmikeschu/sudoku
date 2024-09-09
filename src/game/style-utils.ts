import { COLUMNS, isGuessable, parseCoordinate, ROWS } from "./board";
import { GameSnapshot } from "./gameMachine";
import { Coordinate } from "../types";

export const coordinateToGridArea = (coordinate: Coordinate): string => {
  return `c${coordinate.replace(",", "")}`;
};

export const BOARD_TEMPLATE_AREAS = [...ROWS.entries()]
  .sort(([a], [b]) => a - b)
  .map(([, row]) => `"${row.map(coordinateToGridArea).join(" ")}"`)
  .join(" ");

export const getHighlightedCoordinates = (
  snapshot: GameSnapshot
): Set<Coordinate> => {
  const { context } = snapshot;
  const { fillCoordinate } = context;

  if (snapshot.matches("coordinate") && fillCoordinate) {
    const [row, col] = parseCoordinate(fillCoordinate);
    return new Set([...(ROWS.get(row) ?? []), ...(COLUMNS.get(col) ?? [])]);
  }

  if (snapshot.matches("fill") && context.fillNumber) {
    const { fillNumber, guesses, board } = context;
    const matches = new Set(
      [...board.entries()]
        .filter(([coord, cell]) =>
          isGuessable(cell)
            ? guesses.get(coord) === fillNumber
            : cell.value === fillNumber
        )
        .map(([coord]) => coord)
    );

    return new Set(matches);
  }

  return new Set();
};
