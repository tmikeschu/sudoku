import { cn } from "@/lib/utils";

export function H1({
  children,
  className,
  ...rest
}: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
      {...rest}
    >
      {children}
    </h1>
  );
}
