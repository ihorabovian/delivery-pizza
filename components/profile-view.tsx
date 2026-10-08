"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Pizza, type LucideIcon } from "lucide-react";
import avatarMascot from "@/public/avatar-mascot.png";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { OrderCard } from "@/components/order-card";
import { ProfileEditSheet } from "@/components/profile-edit-sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCardStore } from "@/stores/card-store";
import { useOrderStore } from "@/stores/order-store";
import { useHydrated } from "@/stores/use-hydrated";
import { useUserStore } from "@/stores/user-store";

const TABS = [
  { key: "orders", label: "Orders" },
  { key: "cards", label: "Cards" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const PRIMARY_BUTTON =
  "h-13 w-full cursor-pointer rounded-full bg-[#f14e1d] text-white hover:bg-[#f14e1d]/90";

function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-3xl bg-muted p-6 text-center">
      <Icon className="size-10 text-[#f14e1d]" />
      <p className="mt-2 text-2xl">{title}</p>
      <p className="text-muted-foreground">{text}</p>

      <Button asChild size="lg" className={cn("mt-4", PRIMARY_BUTTON)}>
        <Link href="/">View menu</Link>
      </Button>
    </div>
  );
}

function OrdersTab() {
  const orders = useOrderStore((state) => state.orders);

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-120">
        <EmptyState
          icon={Pizza}
          title="Nothing here yet"
          text="Make a purchase and it will show up here"
        />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-120 flex-col gap-6">
      {orders.map((order) => (
        <OrderCard key={order.number} order={order} />
      ))}
    </div>
  );
}

function CardsTab() {
  const cards = useCardStore((state) => state.cards);
  const removeCard = useCardStore((state) => state.removeCard);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  return (
    <section className="flex w-full flex-col gap-4">
      <h2 className="text-2xl font-bold">My cards</h2>

      {cards.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No saved cards"
          text="Pay for any order by card and it will show up here"
        />
      ) : (
        <ul className="flex flex-wrap gap-4">
          {cards.map((card) => (
            <li key={card.id} className="flex w-32.5 flex-col gap-2">
              <div className="relative h-18 rounded-xl bg-linear-to-tr from-[#f9b49c] to-[#f14e1d] p-2">
                <span className="rounded-full bg-black px-2 py-0.5 text-xs font-extrabold text-white">
                  jB
                </span>
                <span className="absolute right-2 bottom-2 text-white">
                  *{card.last4}
                </span>
              </div>
              <Button
                variant="secondary"
                onClick={() => setCardToDelete(card.id)}
                className="h-8 w-full cursor-pointer rounded-full"
              >
                Delete card
              </Button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={cardToDelete !== null}
        onOpenChange={(open) => !open && setCardToDelete(null)}
        title="Are you sure you want to remove this card from saved cards?"
        confirmLabel="Delete"
        onConfirm={() => cardToDelete && removeCard(cardToDelete)}
      />
    </section>
  );
}

export function ProfileView() {
  const router = useRouter();
  // Every store shown here is restored from localStorage after mount
  const userHydrated = useHydrated(useUserStore.persist);
  const ordersHydrated = useHydrated(useOrderStore.persist);
  const cardsHydrated = useHydrated(useCardStore.persist);
  const { name, email, phone, resetProfile } = useUserStore();
  const [tab, setTab] = useState<TabKey>("orders");
  const [editOpen, setEditOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  if (!userHydrated || !ordersHydrated || !cardsHydrated) return null;

  // No sign-in on this level: "log out" just clears the locally saved profile
  const handleLogout = () => {
    resetProfile();
    router.push("/");
  };

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-10 sm:px-8 lg:px-10">
      <div className="flex justify-end">
        <div className="flex rounded-full bg-muted p-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-2 text-base font-bold",
                tab === key && "bg-background shadow-sm",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">Profile</h1>

      <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-start">
        <section className="flex w-full flex-col gap-4 lg:w-83 lg:shrink-0">
          <div className="flex items-center gap-4">
            {name ? (
              <span className="flex size-21.5 shrink-0 items-center justify-center rounded-full bg-muted text-3xl font-medium">
                {name[0].toUpperCase()}
              </span>
            ) : (
              <Image
                src={avatarMascot}
                alt=""
                aria-hidden
                className="size-21.5 shrink-0 rounded-full bg-orange-50"
              />
            )}
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-2xl">
                {name || "Best customer"}
              </span>
              {email && (
                <span className="truncate text-sm text-muted-foreground">
                  {email}
                </span>
              )}
              {phone && <span className="text-sm">{phone}</span>}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setEditOpen(true)}
              className="h-13 w-full cursor-pointer rounded-full"
            >
              Edit profile
            </Button>
            <Button
              size="lg"
              onClick={() => setLogoutOpen(true)}
              className={PRIMARY_BUTTON}
            >
              Log out
            </Button>
          </div>
        </section>

        {tab === "orders" ? <OrdersTab /> : <CardsTab />}
      </div>

      <ProfileEditSheet open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Are you sure you want to log out of your profile?"
        confirmLabel="Log out"
        onConfirm={handleLogout}
      />
    </main>
  );
}
