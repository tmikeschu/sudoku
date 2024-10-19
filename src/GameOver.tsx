import { AppMachineActorRef } from "./appMachine";
import { Board } from "./types";
import { GameBoard } from "./game/GameBoard";
import { COORDINATES, Difficulty, isGuessable } from "./game/board";
import { Cell } from "./game/Cell";
import { Button } from "@/components/ui/button";
import { Dot } from "@/game/Dot";
import { Small } from "@/components/ui/small";

export const GameOver = ({
  actor,
  board,
  difficulty,
}: {
  actor: AppMachineActorRef;
  board: Board;
  difficulty?: Difficulty;
}) => {
  return (
    <div className="grid gap-y-4 justify-items-center">
      <Small>{difficulty}</Small>

      <GameBoard>
        {COORDINATES.map((coordinate) => {
          const cell = board.get(coordinate);
          if (!cell) return null;

          return (
            <Cell
              key={coordinate}
              disabled
              coordinate={coordinate}
              className={isGuessable(cell) ? "" : "bg-gray-200"}
            >
              <Dot
                value={isGuessable(cell) ? cell.meta?.original : cell.value}
              />
            </Cell>
          );
        })}
      </GameBoard>

      <Button onClick={() => actor.send({ type: "reset" })}>Restart</Button>
    </div>
  );
};
