import { GameActorRef } from "./gameMachine";
import { NUMBERS } from "../types";
import { getHighlightedCoordinates } from "./style-utils";
import {
  getInvalidCoordinates,
  isGuessable,
  isNumberComplete,
  SQUARES,
} from "./board";
import { useSelector } from "@xstate/react";
import { Square } from "./Square";
import { Cell } from "./Cell";
import { GameBoard } from "./GameBoard";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export function Game({ actor }: { actor: GameActorRef }) {
  const { send } = actor;

  const state = actor.getSnapshot();
  console.log(state.context.fillCoordinate);

  const highlights = useSelector(actor, getHighlightedCoordinates);

  const invalids = useSelector(actor, getInvalidCoordinates);

  return (
    <div className="flex flex-col gap-y-4 items-center">
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
                  className={cn({
                    "bg-transparent":
                      !invalids.includes(coordinate) &&
                      highlights.some(
                        ({ coordinate: highlight }) => highlight === coordinate
                      ),
                  })}
                  onClick={() => send({ type: "cell.click", coordinate })}
                  {...(invalids.includes(coordinate)
                    ? { variant: "destructive" }
                    : coordinate === state.context.fillCoordinate
                    ? { variant: "secondary" }
                    : isGuessable(cell)
                    ? { variant: "outline" }
                    : { variant: "ghost" })}
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
          <div
            className="grid bg-blue-200 opacity-50 -z-[1] rounded h-full w-full"
            key={`${gridRow},${gridColumn}`}
            aria-label={`${gridRow},${gridColumn} highlight`}
            style={{ gridColumn, gridRow }}
          />
        ))}
      </GameBoard>

      <div
        className="grid gap-2 w-fit"
        style={{ gridTemplateColumns: "repeat(9, 36px)" }}
      >
        {NUMBERS.map((num) => (
          <Button
            key={num}
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
          <div className="flex justify-end gap-2">
            <AlertDialogCancel onClick={() => send({ type: "cancel" })}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => send({ type: "confirm" })}>
              Reveal
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
