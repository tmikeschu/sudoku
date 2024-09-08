import { AppMachineActorRef } from "./appMachine";
import { Board } from "./types";
import { GameBoard } from "./game/GameBoard";
import { isGuessable, SQUARES } from "./game/board";
import { Square } from "./game/Square";
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
        {SQUARES.map((square, i) => (
          <Square key={i} square={square}>
            {square.flat().map((coordinate) => {
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
          </Square>
        ))}
      </GameBoard>

      <Button onClick={() => actor.send({ type: "reset" })}>Restart</Button>
    </div>
  );
};
