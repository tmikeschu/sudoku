import { GameActorRef } from "./gameMachine";
import { NUMBERS } from "../types";
import { getHighlightedCoordinates } from "./style-utils";
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
import { Dot } from "@/game/Dot";

export function Game({ actor }: { actor: GameActorRef }) {
  const { send } = actor;

  const state = actor.getSnapshot();

  const highlights = useSelector(actor, getHighlightedCoordinates);

  const invalids = useSelector(actor, getInvalidCoordinates);

  const squares = new Set(SQUARES.filter((_, i) => i % 2 === 1).flat(2));

  return (
    <div className="flex flex-col gap-y-4 items-center">
      <Small>{state.context.difficulty}</Small>
      <GameBoard>
        {COORDINATES.map((coordinate) => {
          const cell = state.context.board.get(coordinate);
          if (!cell) return null;
          const val = isGuessable(cell)
            ? state.context.guesses.get(coordinate) ?? ""
            : cell.value;
          return (
            <Cell
              key={coordinate}
              coordinate={coordinate}
              variant={invalids.has(coordinate) ? "destructive" : "outline"}
              className={cn(
                !invalids.has(coordinate) && {
                  "bg-gray-200": squares.has(coordinate),
                  "bg-blue-300": highlights.has(coordinate),
                },
                !isGuessable(cell) ? "pointer-events-none" : "font-normal"
              )}
              {...(isGuessable(cell)
                ? {
                    onClick: () => send({ type: "cell.click", coordinate }),
                  }
                : {})}
            >
              <Dot value={val} />
            </Cell>
          );
        })}
      </GameBoard>

      <div className="grid grid-cols-3 grid-rows-3 gap-4 w-full justify-items-center">
        {NUMBERS.map((num) => (
          <Button
            key={num}
            size="default"
            className=""
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
            <Dot value={num} />
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
