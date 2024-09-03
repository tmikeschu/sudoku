import { Game } from "./game/Game";
import { AppMachineContext } from "./appMachine";
import { Grid, Heading } from "@radix-ui/themes";
import { NotStarted } from "./NotStarted";
import { GameOver } from "./GameOver";

function App() {
  const actor = AppMachineContext.useActorRef();
  const state = AppMachineContext.useSelector((s) => s.value);
  const gameRef = AppMachineContext.useSelector(
    (s) => s.context.gameMachineRef
  );
  const board = gameRef?.getSnapshot().context.board;

  return (
    <Grid gapY="4" maxWidth="352px" align="center" justify="center" mx="auto">
      <Heading>Sudoku</Heading>

      {state === "notStarted" ? (
        <NotStarted actor={actor} />
      ) : state === "playing" && gameRef ? (
        <Game actor={gameRef} />
      ) : state === "gameOver" && board ? (
        <GameOver actor={actor} board={board} />
      ) : null}
    </Grid>
  );
}

export default App;
