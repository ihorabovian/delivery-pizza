import Image from "next/image";
import { Plus, Sparkles } from "lucide-react";
import type { Pizza } from "@/types/pizza";
import { getPizzaImageUrl, getStartingPrice } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PizzaDetailsDialog } from "@/components/pizza-details-dialog";

function getBadgeLabel(pizza: Pizza): string | null {
  if (pizza.isHit) return "Hit";
  if (pizza.isNovelty) return "New";
  if (pizza.isVegetarian) return "Vegan";
  if (pizza.isGlutenFree) return "Gluten-Free";
  return null;
}

function PizzaBadge({ label }: { label: string }) {
  return (
    <span className="absolute left-2 top-2 z-10 inline-flex h-6 items-center justify-center rounded-full bg-[#f14e1d] px-3 text-[10px] font-bold tracking-wide text-white lg:h-auto lg:px-4 lg:py-2 lg:text-xs">
      {label}
    </span>
  );
}

export function PizzaCard({
  pizza,
  featured = false,
}: {
  pizza: Pizza;
  featured?: boolean;
}) {
  const startingPrice = getStartingPrice(pizza);
  const badgeLabel = getBadgeLabel(pizza);

  if (featured) {
    return (
      <Dialog>
        <DialogTrigger className="group relative col-span-2 flex h-81.5 w-full cursor-pointer flex-col justify-between overflow-hidden rounded-3xl bg-orange-500 px-6 pb-6 pt-0 text-center shadow-[0_12px_30px_rgba(244,102,40,0.18)] sm:col-span-3 lg:col-span-1 lg:w-46">
          <div className="relative mx-auto h-46 w-48 rounded-[22px]">
            <Sparkles className="absolute -left-1 top-2 z-20 size-4 rotate-12 text-yellow-200/90" />
            <Sparkles className="absolute right-1 top-6 z-20 size-5 rotate-45 text-yellow-200/90" />
            <Sparkles className="absolute bottom-3 left-4 z-20 size-3 text-yellow-200/90" />
            <Image
              src={getPizzaImageUrl(pizza.img)}
              alt={pizza.name}
              width={192}
              height={184}
              className="h-full w-full translate-x-2 sm:-translate-x-6 object-contain object-center"
            />
          </div>

          <h3 className="text-lg font-bold leading-6 text-white">
            {pizza.name}
          </h3>

          <span className="flex h-10 w-full shrink-0 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-[#232323]">
            from {formatPrice(startingPrice)}
          </span>
        </DialogTrigger>

        <PizzaDetailsDialog pizza={pizza} />
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger className="group relative flex w-full cursor-pointer flex-col gap-3 rounded-3xl bg-neutral-100 p-2 text-left transition-shadow hover:shadow-md lg:h-81.5 lg:w-46 lg:bg-transparent lg:p-0 lg:hover:shadow-none">
        <div className="relative flex aspect-12/13 w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-white pt-2 lg:aspect-auto lg:h-49.5 lg:overflow-hidden lg:rounded-3xl lg:bg-neutral-100 lg:pt-2">
          {badgeLabel && <PizzaBadge label={badgeLabel} />}
          <Image
            src={getPizzaImageUrl(pizza.img)}
            alt={pizza.name}
            fill
            sizes="(max-width: 1024px) 50vw, 184px"
            className="h-full w-full object-contain object-center"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 px-1 pb-1 lg:w-full lg:gap-3 lg:px-0 lg:pb-0">
          <h3 className="text-sm font-medium leading-snug text-foreground lg:h-14 lg:text-lg lg:font-bold lg:leading-6">
            {pizza.name}
          </h3>

          <div className="mt-auto flex h-8 items-center justify-between lg:h-9 lg:rounded-full lg:bg-secondary lg:px-5 lg:py-2">
            <span className="text-sm font-medium text-foreground">
              from {formatPrice(startingPrice)}
            </span>
            <Plus className="size-4 text-foreground" />
          </div>
        </div>
      </DialogTrigger>

      <PizzaDetailsDialog pizza={pizza} />
    </Dialog>
  );
}
