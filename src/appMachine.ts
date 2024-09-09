import { ActorRefFrom, assign, setup } from "xstate";
import { Difficulty } from "./game/board";
import { GameActorRef, gameMachine } from "./game/gameMachine";
import { createActorContext } from "@xstate/react";

type Context = {
  gameMachineRef?: GameActorRef;
};

type Event =
  | { type: "start"; difficulty: Difficulty }
  | { type: "quit" }
  | { type: "reset" }
  | { type: "gameOver" };

export const appMachine = setup({
  types: {
    events: {} as Event,
    context: {} as Context,
  },
}).createMachine({
  initial: "notStarted",
  states: {
    notStarted: {
      on: {
        start: {
          target: "playing",
          actions: assign({
            gameMachineRef: ({ spawn, event }) =>
              spawn(gameMachine, { input: { difficulty: event.difficulty } }),
          }),
        },
      },
    },
    playing: {
      on: {
        quit: "notStarted",
        gameOver: { target: "gameOver" },
      },
    },
    gameOver: {
      on: {
        reset: "notStarted",
      },
    },
  },
});

export const AppMachineContext = createActorContext(appMachine);

export type AppMachineActorRef = ActorRefFrom<typeof appMachine>;
