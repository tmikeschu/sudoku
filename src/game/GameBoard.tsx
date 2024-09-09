import { BOARD_TEMPLATE_AREAS } from "./style-utils";
import { cn } from "@/lib/utils";

export const GameBoard = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("grid content-start grid-cols-9", className)}
      style={{ gridTemplateAreas: BOARD_TEMPLATE_AREAS }}
      {...props}
    >
      {children}
    </div>
  );
};
