import { Button, ButtonProps } from "@/components/ui/button";
import { Coordinate } from "../types";
import { coordinateToGridArea } from "./style-utils";
import { cn } from "@/lib/utils";

export const Cell = ({
  coordinate,
  children,
  className,
  ...rest
}: ButtonProps & { coordinate: Coordinate }) => {
  return (
    <Button
      className={cn("aspect-square w-full h-full rounded-none", className)}
      style={{ gridArea: coordinateToGridArea(coordinate), ...rest.style }}
      variant="outline"
      {...rest}
    >
      <div className="flex justify-center items-center">{children}</div>
    </Button>
  );
};
