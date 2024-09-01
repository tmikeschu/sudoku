import { Heading, Grid, Flex, Tooltip } from "@radix-ui/themes";
import { useMachine } from "@xstate/react";
import { sudokuMachine } from "./machine";

function App() {
  const [state] = useMachine(sudokuMachine);

  return (
    <>
      <Heading>Sudoku</Heading>
      <Grid
        width="320px"
        height="320px"
        rows="repeat(9, 1fr)"
        columns="repeat(9, 1fr)"
        gap="0"
        align="start"
        style={{
          border: "1px solid gray",
        }}
      >
        {[...state.context.board.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([coordinate, cell]) => (
            <Grid
              key={coordinate}
              align="center"
              justify="center"
              width="100%"
              height="100%"
              style={{
                border: "1px solid gray",
                ...(cell.info?.leftBoard
                  ? { borderLeft: "2px solid black" }
                  : {}),
                background: cell.value === 0 ? "white" : "lightgray",
              }}
            >
              <Tooltip content={JSON.stringify(cell.info ?? {})}>
                <Flex justify="center" align="center">
                  {cell.value === 0
                    ? state.context.guesses.get(coordinate) ?? ""
                    : cell.value}
                </Flex>
              </Tooltip>
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default App;
