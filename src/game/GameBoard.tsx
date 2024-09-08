import { BOARD_TEMPLATE_AREAS, getSquareGridShading } from "./style-utils";
import { SQUARES } from "./board";
import { cn } from "@/lib/utils";

export const GameBoard = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "grid w-fit gap-2 content-start grid-cols-[repeat(9,_36px)] grid-rows-[repeat(9,_36px)]",
        className
      )}
      style={{ gridTemplateAreas: BOARD_TEMPLATE_AREAS }}
      {...props}
    >
      {children}

      {SQUARES.filter((_, i) => i % 2 === 1).map((square, i) => (
        <div
          key={i}
          className="grid -z-[2] justify-self-end bg-gray-100 rounded -mt-[5px] -mr-[5px]"
          style={{
            height: "calc(100% + 10px)",
            width: "calc(100% + 10px)",
            ...getSquareGridShading(square),
          }}
        />
      ))}
    </div>
  );
};
