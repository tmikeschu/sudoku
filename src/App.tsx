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

  return (
    <Grid gapY="4">
      <Heading>Sudoku</Heading>

      {state === "notStarted" ? (
        <NotStarted actor={actor} />
      ) : state === "playing" && gameRef ? (
        <Game actor={gameRef} />
      ) : (
        <GameOver actor={actor} />
      )}
    </Grid>
  );
}

export default App;
