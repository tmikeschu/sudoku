import { useState } from "react";
import { Button, Heading, Text } from "@radix-ui/themes";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Heading>Vite + React</Heading>
      <Button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>
      <Text>
        Edit <code>src/App.tsx</code> and save to test HMR
      </Text>
      <Text className="read-the-docs">
        Click on the Vite and React logos to learn more
      </Text>
    </>
  );
}

export default App;
