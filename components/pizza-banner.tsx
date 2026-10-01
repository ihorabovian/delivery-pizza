import Image from "next/image";
import { cn } from "@/lib/utils";
import banner from "@/public/pizza-banner.png";

export function PizzaBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative hidden h-75 w-full overflow-hidden rounded-[28px] p-4 lg:flex lg:h-[365px] lg:w-68 lg:flex-col",
        className,
      )}
    >
      <Image
        src={banner}
        alt="Illustration of pizza delivery around the world"
        fill
        sizes="272px"
        className="object-cover"
        aria-hidden
      />
      <div />
      <p className="relative z-10 max-w-[220px] text-2xl font-bold leading-8 tracking-[-0.04em] text-white">
        Enjoy our pizza from anywhere in the world
      </p>
    </div>
  );
}
