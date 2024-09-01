import { Heading, Grid, Flex, Button, Text } from "@radix-ui/themes";
import { useMachine } from "@xstate/react";
import { sudokuMachine } from "./machine";
import { NUMBERS } from "./types";
import {
  BOARD_TEMPLATE_AREAS,
  coordinateToGridArea,
  getSquareTemplateAreas,
} from "./style-utils";
import { SQUARES } from "./board";

function App() {
  const [state, send] = useMachine(sudokuMachine);

  return (
    <>
      <Heading>Sudoku</Heading>
      <Flex gapY="4" direction="column">
        <Grid
          width="fit-content"
          rows="repeat(3, 104px)"
          columns="repeat(3, 104px)"
          areas={BOARD_TEMPLATE_AREAS}
          gap="2"
          align="start"
        >
          {SQUARES.map((square, i) => (
            <Grid
              key={i}
              rows="repeat(3, 32px)"
              columns="repeat(3, 32px)"
              gridArea={`s${i}`}
              gap="1"
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
                    {...(cell.value === 0
                      ? {
                          variant: "outline",
                          color:
                            state.context.currentNumber &&
                            state.context.guesses.get(coordinate) ===
                              state.context.currentNumber
                              ? "teal"
                              : "gray",
                        }
                      : {
                          variant: "soft",
                          // highContrast: true,
                          color:
                            cell.value === state.context.currentNumber
                              ? "teal"
                              : "gray",
                        })}
                  >
                    {cell.value === 0 ? (
                      <Flex justify="center" align="center">
                        <Text>
                          {state.context.guesses.get(coordinate) ?? ""}
                        </Text>
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
        </Grid>

        <Flex gap="1">
          {NUMBERS.map((num) => (
            <Button
              key={num}
              variant={
                state.context.currentNumber === num ? "solid" : "outline"
              }
              onClick={() => send({ type: "SET_CURRENT_NUMBER", number: num })}
            >
              {num}
            </Button>
          ))}
        </Flex>
      </Flex>
    </>
  );
}

export default App;
