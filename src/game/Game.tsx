import { Grid, Flex, Button, Text, AlertDialog } from "@radix-ui/themes";
import { GameActorRef } from "./gameMachine";
import { NUMBERS } from "../types";
import {
  BOARD_TEMPLATE_AREAS,
  coordinateToGridArea,
  getSquareTemplateAreas,
  getSquareGridColumn,
  getSquareGridRow,
  getHighlightedCoordinates,
  getSquareGridShading,
} from "./style-utils";
import { getInvalidCoordinates, isGuessable, SQUARES } from "./board";
import { useSelector } from "@xstate/react";

export function Game({ actor }: { actor: GameActorRef }) {
  const { send } = actor;

  const state = actor.getSnapshot();
  console.log(state.value);

  const highlights = useSelector(actor, getHighlightedCoordinates);

  const invalids = useSelector(actor, getInvalidCoordinates);

  return (
    <Flex direction="column" gapY="4">
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
                  onClick={() => send({ type: "cell.click", coordinate })}
                  color={invalids.includes(coordinate) ? "red" : undefined}
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
            onClick={() => send({ type: "fill_number.click", number: num })}
          >
            {num}
          </Button>
        ))}

        <AlertDialog.Root open={state.matches("confirmReveal")}>
          <AlertDialog.Trigger>
            <Button
              variant="ghost"
              color="red"
              onClick={() => send({ type: "reveal" })}
            >
              Reveal
            </Button>
          </AlertDialog.Trigger>

          <AlertDialog.Content>
            <AlertDialog.Title>Reveal?</AlertDialog.Title>
            <AlertDialog.Description>
              <Text>This will end the game</Text>
            </AlertDialog.Description>
            <Flex align="end">
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
      </Grid>
    </Flex>
  );
}
