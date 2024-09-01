import { Heading, Grid, Flex, Button, Text } from "@radix-ui/themes";
import { useMachine } from "@xstate/react";
import { sudokuMachine } from "./machine";
import { NUMBERS } from "./types";
import { BOARD_TEMPLATE_AREAS, coordinateToGridArea } from "./style-utils";

function App() {
  const [state, send] = useMachine(sudokuMachine);

  return (
    <>
      <Heading>Sudoku</Heading>
      <Flex gapY="4" direction="column">
        <Grid
          width="fit-content"
          rows="repeat(9, 32px)"
          columns="repeat(9, 32px)"
          areas={BOARD_TEMPLATE_AREAS}
          gap="1"
          align="start"
          style={{
            position: "relative",
          }}
        >
          <hr
            style={{
              position: "absolute",
              left: `104px`,
              height: "100%",
              width: "1px",
              margin: 0,
              backgroundColor: "var(--blue-indicator)",
            }}
          />
          <hr
            style={{
              position: "absolute",
              left: `213px`,
              height: "100%",
              width: "1px",
              margin: 0,
              backgroundColor: "var(--blue-indicator)",
            }}
          />
          <hr
            style={{
              position: "absolute",
              top: `105px`,
              left: 0,
              width: "100%",
              height: "1px",
              margin: 0,
              backgroundColor: "var(--blue-indicator)",
            }}
          />
          <hr
            style={{
              position: "absolute",
              top: `213px`,
              left: 0,
              width: "100%",
              height: "1px",
              margin: 0,
              backgroundColor: "var(--blue-indicator)",
            }}
          />
          {[...state.context.board.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([coordinate, cell]) => (
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
                    <Text>{state.context.guesses.get(coordinate) ?? ""}</Text>
                  </Flex>
                ) : (
                  <Flex justify="center" align="center">
                    <Text>{cell.value}</Text>
                  </Flex>
                )}
              </Button>
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
