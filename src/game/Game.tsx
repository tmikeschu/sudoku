import { GameActorRef } from "./gameMachine";
import { NUMBERS } from "../types";
import { coordinateToGridArea, getHighlightedCoordinates } from "./style-utils";
import {
  COORDINATES,
  getInvalidCoordinates,
  isGuessable,
  isNumberComplete,
  SQUARES,
} from "./board";
import { useSelector } from "@xstate/react";
import { Cell } from "./Cell";
import { GameBoard } from "./GameBoard";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Small } from "@/components/ui/small";

export function Game({ actor }: { actor: GameActorRef }) {
  const { send } = actor;

  const state = actor.getSnapshot();

  const highlights = useSelector(actor, getHighlightedCoordinates);

  const invalids = useSelector(actor, getInvalidCoordinates);

  const squares = SQUARES.filter((_, i) => i % 2 === 1).flat(2);

  return (
    <div className="flex flex-col gap-y-4 items-center">
      <Small>{state.context.difficulty}</Small>
      <GameBoard>
        {COORDINATES.map((coordinate) => {
          const cell = state.context.board.get(coordinate);
          if (!cell) return null;
          return (
            <Cell
              key={coordinate}
              coordinate={coordinate}
              className={cn({
                "bg-transparent":
                  squares.includes(coordinate) ||
                  (!invalids.includes(coordinate) &&
                    highlights.some(
                      ({ coordinate: highlight }) => highlight === coordinate
                    )),
              })}
              onClick={() => send({ type: "cell.click", coordinate })}
              disabled={!isGuessable(cell)}
              {...(invalids.includes(coordinate)
                ? { variant: "destructive" }
                : coordinate === state.context.fillCoordinate
                ? { variant: "secondary" }
                : // : isGuessable(cell)
                  { variant: "outline" })}
              // : { variant: "ghost" })}
            >
              {isGuessable(cell)
                ? state.context.guesses.get(coordinate) ?? ""
                : cell.value}
            </Cell>
          );
        })}

        {squares.map((coord) => (
          <div
            className="grid bg-gray-200 opacity-50 -z-[1] h-full w-full"
            key={coord}
            style={{ gridArea: coordinateToGridArea(coord) }}
          />
        ))}

        {highlights.map(({ gridColumn, gridRow }) => (
          <div
            className="grid bg-blue-500 opacity-50 -z-[1] h-full w-full"
            key={`${gridRow},${gridColumn}`}
            aria-label={`${gridRow},${gridColumn} highlight`}
            style={{ gridColumn, gridRow }}
          />
        ))}
      </GameBoard>

      <div className="grid grid-cols-3 grid-rows-3 gap-4 w-full justify-items-center">
        {NUMBERS.map((num) => (
          <Button
            key={num}
            size="default"
            className="text-lg w-12 h-12"
            variant={
              isNumberComplete({
                board: state.context.board,
                guesses: state.context.guesses,
                number: num,
              })
                ? "secondary"
                : state.context.fillNumber === num
                ? "default"
                : "ghost"
            }
            onClick={() => send({ type: "fill_number.click", number: num })}
          >
            {num}
          </Button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="destructive" onClick={() => send({ type: "reveal" })}>
          Reveal
        </Button>
      </div>

      <AlertDialog open={state.matches("confirmReveal")}>
        <AlertDialogContent>
          <AlertDialogTitle>Reveal?</AlertDialogTitle>
          <AlertDialogDescription>
            <span>This will end the game.</span>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => send({ type: "cancel" })}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => send({ type: "confirm" })}>
              Reveal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
