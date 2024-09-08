import { Game } from "./game/Game";
import { AppMachineContext } from "./appMachine";
import { NotStarted } from "./NotStarted";
import { GameOver } from "./GameOver";
import { H1 } from "@/components/ui/h1";

function App() {
  const actor = AppMachineContext.useActorRef();
  const state = AppMachineContext.useSelector((s) => s.value);
  const gameRef = AppMachineContext.useSelector(
    (s) => s.context.gameMachineRef
  );
  const board = gameRef?.getSnapshot().context.board;

  return (
    <div className="grid gap-y-4 max-w-[352px] content-center justify-items-center mx-auto">
      <H1>Sudoku</H1>

      {state === "notStarted" ? (
        <NotStarted actor={actor} />
      ) : state === "playing" && gameRef ? (
        <Game actor={gameRef} />
      ) : state === "gameOver" && board ? (
        <GameOver actor={actor} board={board} />
      ) : null}
    </div>
  );
}

export default App;
