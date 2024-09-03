import { Grid, GridProps } from "@radix-ui/themes";
import { BOARD_TEMPLATE_AREAS, getSquareGridShading } from "./style-utils";
import { SQUARES } from "./board";

export const GameBoard = ({ children, ...props }: GridProps) => {
  return (
    <Grid
      width="fit-content"
      rows="repeat(9, 32px)"
      columns="repeat(9, 32px)"
      areas={BOARD_TEMPLATE_AREAS}
      gap="2"
      align="start"
      {...props}
    >
      {children}

      {SQUARES.filter((_, i) => i % 2 === 1).map((square, i) => (
        <Grid
          key={i}
          style={{
            border: "2px solid var(--gray-a6)",
            zIndex: -1,
            justifySelf: "end",
            borderRadius: "4px",
            marginTop: "-5px",
            marginRight: "-5px",
          }}
          {...getSquareGridShading(square)}
          height="calc(100% + 10px)"
          width="calc(100% + 10px)"
        />
      ))}
    </Grid>
  );
};
