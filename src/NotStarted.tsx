import { Button } from "@/components/ui/button";
import { AppMachineActorRef } from "./appMachine";

export const NotStarted = ({ actor }: { actor: AppMachineActorRef }) => {
  return (
    <div className="grid grid-cols-[repeat(3,_64px)] gap-2">
      <Button
        onClick={() => actor.send({ type: "start", difficulty: "easy" })}
        variant="ghost"
      >
        Easy
      </Button>
      <Button
        onClick={() => actor.send({ type: "start", difficulty: "medium" })}
        variant="ghost"
      >
        Medium
      </Button>
      <Button
        onClick={() => actor.send({ type: "start", difficulty: "hard" })}
        variant="ghost"
      >
        Hard
      </Button>
    </div>
  );
};
