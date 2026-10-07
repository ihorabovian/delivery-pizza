"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  confirmLabel,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col items-center gap-4 rounded-3xl bg-background px-12 py-6 text-center sm:max-w-136"
      >
        <span
          aria-hidden
          className="flex size-12 items-center justify-center rounded-full bg-[#f14e1d] text-2xl font-bold text-white"
        >
          ?
        </span>
        <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Confirm or cancel this action
        </DialogDescription>

        <div className="mt-2 flex w-full flex-col gap-4">
          <DialogClose asChild>
            <Button
              variant="secondary"
              size="lg"
              className="h-13 w-full cursor-pointer rounded-full"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            size="lg"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="h-13 w-full cursor-pointer rounded-full bg-[#f14e1d] text-white hover:bg-[#f14e1d]/90"
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
