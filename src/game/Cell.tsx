import { Coordinate } from "../types";
import { Button, ButtonProps, Flex, Text } from "@radix-ui/themes";
import { coordinateToGridArea } from "./style-utils";

export const Cell = ({
  coordinate,
  children,
  ...rest
}: ButtonProps & { coordinate: Coordinate }) => {
  return (
    <Button
      style={{ gridArea: coordinateToGridArea(coordinate), ...rest.style }}
      variant="soft"
      {...rest}
    >
      <Flex justify="center" align="center">
        <Text>{children}</Text>
      </Flex>
    </Button>
  );
};
