import { cn } from "@/lib/utils";

export function PizzaBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative hidden h-75 w-full overflow-hidden rounded-[28px] bg-cover bg-center p-4 lg:flex lg:h-[365px] lg:w-68 lg:flex-col",
        className,
      )}
      style={{ backgroundImage: "url(/pizza-banner.png)" }}
    >
      <div />
      <p className="relative z-10 max-w-[220px] text-2xl font-bold leading-8 tracking-[-0.04em] text-white">
        Enjoy our pizza from anywhere in the world
      </p>
    </div>
  );
}
