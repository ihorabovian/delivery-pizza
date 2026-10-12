"use client";

import { useState, type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useAddressStore } from "@/stores/address-store";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useOrderStore } from "@/stores/order-store";

// Log out with a confirmation; shared by the header and the profile page
export function LogoutButton(props: ComponentProps<typeof Button>) {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    // The next person on this browser starts clean
    useCartStore.getState().clearCart();
    useAddressStore.setState({ address: "", street: "", house: "" });
    useOrderStore.setState({ orders: [] });
    router.push("/");
  };

  return (
    <>
      <Button {...props} onClick={() => setOpen(true)}>
        Log out
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Are you sure you want to log out of your profile?"
        confirmLabel="Log out"
        onConfirm={handleLogout}
      />
    </>
  );
}
