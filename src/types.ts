export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type Column = (typeof NUMBERS)[number];

export type Row = (typeof NUMBERS)[number];

export type Coordinate = `${Row},${Column}`;

export type CellMeta = { original: number };

export type CellValue = number;

export type Cell = { value: CellValue; meta?: CellMeta };

export type Board = Map<Coordinate, Cell>;
