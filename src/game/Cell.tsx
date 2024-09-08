import { Button, ButtonProps } from "@/components/ui/button";
import { Coordinate } from "../types";
import { coordinateToGridArea } from "./style-utils";

export const Cell = ({
  coordinate,
  children,
  ...rest
}: ButtonProps & { coordinate: Coordinate }) => {
  return (
    <Button
      size="sm"
      style={{ gridArea: coordinateToGridArea(coordinate), ...rest.style }}
      variant="outline"
      {...rest}
    >
      <div className="flex justify-center items-center">
        <span>{children}</span>
      </div>
    </Button>
  );
};
