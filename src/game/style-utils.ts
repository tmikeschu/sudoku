import { COLUMNS, isGuessable, parseCoordinate, ROWS, Square } from "./board";
import { GameSnapshot } from "./gameMachine";
import { Coordinate } from "../types";
import { ButtonProps } from "@/components/ui/button";

export const coordinateToGridArea = (coordinate: Coordinate): string => {
  return `c${coordinate.replace(",", "")}`;
};

export const getSquareTemplateAreas = (square: Square) =>
  square.map((row) => `"${row.map(coordinateToGridArea).join(" ")}"`).join(" ");

export const getSquareGridColumn = (square: Square) => {
  const [first, , last] = square[0].map(coordinateToGridArea);
  return [first, last].join(" / ");
};

export const getSquareGridRow = (square: Square) => {
  const [first, last] = square.map((x) => x[0]).map(coordinateToGridArea);
  return [first, last].join(" / ");
};

export const BOARD_TEMPLATE_AREAS = [...ROWS.entries()]
  .sort(([a], [b]) => a - b)
  .map(([, row]) => `"${row.map(coordinateToGridArea).join(" ")}"`)
  .join(" ");

export const shouldHighlightSquare = (
  snapshot: GameSnapshot,
  coordinate: Coordinate
): boolean => {
  const cell = snapshot.context.board.get(coordinate);
  if (!cell) return false;

  if (snapshot.matches("fill")) {
    const { fillNumber, guesses } = snapshot.context;
    const value = isGuessable(cell) ? guesses.get(coordinate) : cell.value;
    return fillNumber !== undefined && value === fillNumber;
  }

  if (snapshot.matches("coordinate") && snapshot.context.fillCoordinate) {
    const { fillCoordinate } = snapshot.context;
    const [fillRow, fillColumn] = parseCoordinate(fillCoordinate);
    const [row, column] = parseCoordinate(coordinate);

    return row === fillRow || column === fillColumn;
  }

  return false;
};

export const getCellHighlightColor = (
  snapshot: GameSnapshot,
  coordinate: Coordinate
): ButtonProps["color"] => {
  if (!shouldHighlightSquare(snapshot, coordinate)) return "gray";

  const { fillCoordinate } = snapshot.context;
  if (snapshot.matches("coordinate") && fillCoordinate === coordinate)
    return "blue";

  return "teal";
};

export const getHighlightedCoordinates = (
  snapshot: GameSnapshot
): { gridColumn: string; gridRow: string; coordinate: Coordinate }[] => {
  const { context } = snapshot;
  const { fillCoordinate } = context;

  const toGridDef = (coord: Coordinate) => {
    const area = coordinateToGridArea(coord);
    return { gridColumn: area, gridRow: area, coordinate: coord };
  };
  if (snapshot.matches("coordinate") && fillCoordinate) {
    const [row, col] = parseCoordinate(fillCoordinate);
    return [
      ...new Set([...(ROWS.get(row) ?? []), ...(COLUMNS.get(col) ?? [])]),
    ].map(toGridDef);
  }

  if (snapshot.matches("fill") && context.fillNumber) {
    const { fillNumber, guesses, board } = context;
    const matches = [...board.entries()]
      .filter(([coord, cell]) =>
        isGuessable(cell)
          ? guesses.get(coord) === fillNumber
          : cell.value === fillNumber
      )
      .map(([coord]) => toGridDef(coord));

    return matches;
  }

  return [];
};

export function getSquareGridShading(square: Square) {
  const [[topLeft, , topRight], , [bottomLeft]] = square;

  const gridColumn = [topLeft, topRight].map(coordinateToGridArea).join(" / ");
  const gridRow = [topLeft, bottomLeft].map(coordinateToGridArea).join(" / ");
  return { gridColumn, gridRow };
}
