import { Button, Grid } from "@radix-ui/themes";
import { AppMachineActorRef } from "./appMachine";

export const GameOver = ({ actor }: { actor: AppMachineActorRef }) => {
  return (
    <Grid>
      {/* TODO reveal board with disabled styling */}
      <Button onClick={() => actor.send({ type: "reset" })}>Restart</Button>
    </Grid>
  );
};
