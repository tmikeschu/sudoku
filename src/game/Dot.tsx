import { cn } from "@/lib/utils";
import React from "react";

export const Dot = ({
  value,
  className,
  ...props
}: { value?: number | string } & React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "inline-flex rounded-full w-6 h-6",
        {
          "bg-pink-500": value === 1,
          "bg-orange-500": value === 2,
          "bg-yellow-500": value === 3,
          "bg-green-500": value === 4,
          "bg-emerald-700": value === 5,
          "bg-cyan-300": value === 6,
          "bg-blue-500": value === 7,
          "bg-violet-600": value === 8,
          "bg-indigo-800": value === 9,
        },
        className
      )}
      {...props}
    />
  );
};
