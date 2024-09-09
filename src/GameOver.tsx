import { AppMachineActorRef } from "./appMachine";
import { Board } from "./types";
import { GameBoard } from "./game/GameBoard";
import { COORDINATES, isGuessable } from "./game/board";
import { Cell } from "./game/Cell";
import { Button } from "@/components/ui/button";

export const GameOver = ({
  actor,
  board,
}: {
  actor: AppMachineActorRef;
  board: Board;
}) => {
  return (
    <div className="grid gap-y-4 justify-items-start">
      <GameBoard>
        {COORDINATES.map((coordinate) => {
          const cell = board.get(coordinate);
          if (!cell) return null;

          return (
            <Cell
              key={coordinate}
              disabled
              coordinate={coordinate}
              {...(isGuessable(cell)
                ? { variant: "outline" }
                : { variant: "ghost" })}
            >
              {isGuessable(cell) ? cell.meta?.original : cell.value}
            </Cell>
          );
        })}
      </GameBoard>

      <Button onClick={() => actor.send({ type: "reset" })}>Restart</Button>
    </div>
  );
};
