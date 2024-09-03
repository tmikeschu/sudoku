import { Grid, Flex, Button, Text, AlertDialog } from "@radix-ui/themes";
import { GameActorRef } from "./gameMachine";
import { NUMBERS } from "../types";
import { getHighlightedCoordinates } from "./style-utils";
import { getInvalidCoordinates, isGuessable, SQUARES } from "./board";
import { useSelector } from "@xstate/react";
import { Square } from "./Square";
import { Cell } from "./Cell";
import { GameBoard } from "./GameBoard";

export function Game({ actor }: { actor: GameActorRef }) {
  const { send } = actor;

  const state = actor.getSnapshot();

  const highlights = useSelector(actor, getHighlightedCoordinates);

  const invalids = useSelector(actor, getInvalidCoordinates);

  return (
    <Flex direction="column" gapY="4" align={"center"}>
      <GameBoard>
        {SQUARES.map((square, i) => (
          <Square key={i} square={square}>
            {square.flat().map((coordinate) => {
              const cell = state.context.board.get(coordinate);
              if (!cell) return null;

              return (
                <Cell
                  key={coordinate}
                  coordinate={coordinate}
                  onClick={() => send({ type: "cell.click", coordinate })}
                  color={invalids.includes(coordinate) ? "red" : undefined}
                  {...(coordinate === state.context.fillCoordinate
                    ? { variant: "surface" }
                    : isGuessable(cell)
                    ? { variant: "outline" }
                    : { variant: "soft" })}
                >
                  {isGuessable(cell)
                    ? state.context.guesses.get(coordinate) ?? ""
                    : cell.value}
                </Cell>
              );
            })}
          </Square>
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
      </GameBoard>

      <Grid gap="2" columns="repeat(9, 32px)" width="fit-content">
        {NUMBERS.map((num) => (
          <Button
            key={num}
            color={state.context.fillNumber === num ? undefined : "gray"}
            variant={state.context.fillNumber === num ? "solid" : "surface"}
            onClick={() => send({ type: "fill_number.click", number: num })}
          >
            {num}
          </Button>
        ))}
      </Grid>

      <Flex justify="end">
        <Button
          variant="ghost"
          color="red"
          onClick={() => send({ type: "reveal" })}
        >
          Reveal
        </Button>
      </Flex>
      <AlertDialog.Root open={state.matches("confirmReveal")}>
        <AlertDialog.Content>
          <AlertDialog.Title>Reveal?</AlertDialog.Title>
          <AlertDialog.Description>
            <Text>This will end the game.</Text>
          </AlertDialog.Description>
          <Flex justify="end" gap="2">
            <AlertDialog.Cancel>
              <Button color="gray" onClick={() => send({ type: "cancel" })}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={() => send({ type: "confirm" })}>
                Reveal
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Flex>
  );
}
