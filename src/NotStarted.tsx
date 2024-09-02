import { Button, Grid } from "@radix-ui/themes";
import { AppMachineActorRef } from "./appMachine";

export const NotStarted = ({ actor }: { actor: AppMachineActorRef }) => {
  return (
    <Grid columns="repeat(3, 64px)" gap="2">
      <Button
        onClick={() => actor.send({ type: "start", difficulty: "easy" })}
        color="green"
        variant="soft"
      >
        Easy
      </Button>
      <Button
        onClick={() => actor.send({ type: "start", difficulty: "medium" })}
        variant="soft"
        color="blue"
      >
        Medium
      </Button>
      <Button
        onClick={() => actor.send({ type: "start", difficulty: "hard" })}
        variant="soft"
        color="purple"
      >
        Hard
      </Button>
    </Grid>
  );
};
