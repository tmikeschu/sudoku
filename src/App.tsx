import { Heading, Grid, Flex, Button, Text } from "@radix-ui/themes";
import { useMachine } from "@xstate/react";
import { sudokuMachine } from "./machine";
import { NUMBERS } from "./types";
import {
  BOARD_TEMPLATE_AREAS,
  coordinateToGridArea,
  getSquareTemplateAreas,
  getSquareGridColumn,
  getSquareGridRow,
  getHighlightedCoordinates,
  getSquareGridShading,
} from "./style-utils";
import { isGuessable, SQUARES } from "./board";

function App() {
  const [state, send] = useMachine(sudokuMachine);

  const highlights = getHighlightedCoordinates(state);

  return (
    <Flex direction="column" gapY="4">
      <Heading>Sudoku</Heading>

      <Grid
        width="fit-content"
        rows="repeat(9, 32px)"
        columns="repeat(9, 32px)"
        areas={BOARD_TEMPLATE_AREAS}
        gap="2"
        align="start"
      >
        {SQUARES.map((square, i) => (
          <Grid
            key={i}
            rows="repeat(3, 32px)"
            columns="repeat(3, 32px)"
            gap="2"
            gridColumn={getSquareGridColumn(square)}
            gridRow={getSquareGridRow(square)}
            areas={getSquareTemplateAreas(square)}
          >
            {square.flat().map((coordinate) => {
              const cell = state.context.board.get(coordinate);
              if (!cell) return null;

              return (
                <Button
                  key={coordinate}
                  style={{ gridArea: coordinateToGridArea(coordinate) }}
                  onClick={() => send({ type: "CLICK_CELL", coordinate })}
                  {...(coordinate === state.context.fillCoordinate
                    ? { variant: "surface" }
                    : isGuessable(cell)
                    ? { variant: "outline" }
                    : { variant: "soft" })}
                >
                  {isGuessable(cell) ? (
                    <Flex justify="center" align="center">
                      <Text>{state.context.guesses.get(coordinate) ?? ""}</Text>
                    </Flex>
                  ) : (
                    <Flex justify="center" align="center">
                      <Text>{cell.value}</Text>
                    </Flex>
                  )}
                </Button>
              );
            })}
          </Grid>
        ))}
        {highlights.map(({ gridColumn, gridRow }) => (
          <Grid
            key={`${gridRow},${gridColumn}`}
            aria-label={`${gridRow},${gridColumn} highlight`}
            style={{
              backgroundColor: "var(--accent-a7)",
              opacity: 0.5,
              zIndex: -1,
              borderRadius: "4px",
            }}
            gridColumn={gridColumn}
            gridRow={gridRow}
            height="100%"
            width="100%"
          />
        ))}

        {SQUARES.filter((_, i) => i % 2 === 1).map((square, i) => (
          <Grid
            key={i}
            style={{
              // TODO figure out how to get padding on square borders
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

      <Grid gap="2" columns="repeat(9, 32px)" width="fit-content">
        {NUMBERS.map((num) => (
          <Button
            key={num}
            color={state.context.fillNumber === num ? undefined : "gray"}
            variant={state.context.fillNumber === num ? "solid" : "surface"}
            onClick={() => send({ type: "CLICK_FILL_NUMBER", number: num })}
          >
            {num}
          </Button>
        ))}
      </Grid>
    </Flex>
  );
}

export default App;
