export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type Column = (typeof NUMBERS)[number];

export type Row = (typeof NUMBERS)[number];

export type Coordinate = `${Row},${Column}`;

export type CellInfo = { original: number } & Partial<{
  leftSquare: boolean;
  leftBoard: boolean;
  topSquare: boolean;
  topBoard: boolean;
  rightSquare: boolean;
  rightBoard: boolean;
  bottomSquare: boolean;
  bottomBoard: boolean;
}>;

export type CellValue = number;

export type Cell = { value: CellValue; info?: CellInfo };

export type Board = Map<Coordinate, Cell>;
