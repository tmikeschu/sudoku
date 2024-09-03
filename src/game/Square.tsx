import { Grid } from "@radix-ui/themes";
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
    <Grid
      rows="repeat(3, 32px)"
      columns="repeat(3, 32px)"
      gap="2"
      gridColumn={getSquareGridColumn(square)}
      gridRow={getSquareGridRow(square)}
      areas={getSquareTemplateAreas(square)}
    >
      {children}
    </Grid>
  );
};
