import { PropsWithChildren } from "react";
import { Square as TSquare } from "./board";
import {
  getSquareGridColumn,
  getSquareGridRow,
  getSquareTemplateAreas,
} from "./style-utils";

export const Square = ({
  children,
  square,
}: PropsWithChildren<{ square: TSquare }>) => {
  return (
    <div
      className="grid gap-2 grid-rows-[repeat(3,_32px)] grid-cols-[repeat(3,_32px)]"
      style={{
        gridTemplateAreas: getSquareTemplateAreas(square),
        gridColumn: getSquareGridColumn(square),
        gridRow: getSquareGridRow(square),
      }}
    >
      {children}
    </div>
  );
};
