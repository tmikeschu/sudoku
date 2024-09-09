import { cn } from "@/lib/utils";

export function Small({
  children,
  className,
  ...rest
}: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <small
      className={cn("text-sm font-medium leading-none", className)}
      {...rest}
    >
      {children}
    </small>
  );
}
