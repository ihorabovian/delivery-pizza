"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUserStore, type UserProfile } from "@/stores/user-store";

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "given-name" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
] as const;

const inputClassName =
  "w-full rounded-full border border-border bg-background px-4 py-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

// Mounted only while the sheet is open, so it starts from the saved profile each time
function ProfileForm({ onSaved }: { onSaved: () => void }) {
  const [values, setValues] = useState<UserProfile>(() => {
    const { name, phone, email } = useUserStore.getState();
    return { name, phone, email };
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    useUserStore.getState().updateProfile({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
    });
    toast.success("Details updated");
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 px-6">
      {FIELDS.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label htmlFor={`profile-${field.name}`} className="text-sm">
            {field.label}
          </label>
          <input
            id={`profile-${field.name}`}
            type={field.type}
            autoComplete={field.autoComplete}
            value={values[field.name]}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                [field.name]: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </div>
      ))}

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        className="mt-4 h-13 w-full cursor-pointer rounded-full"
      >
        Update details
      </Button>
    </form>
  );
}

export function ProfileEditSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-119">
        <SheetHeader className="p-6">
          <SheetTitle className="font-sans text-2xl font-bold">
            Edit details
          </SheetTitle>
          <SheetDescription className="sr-only">
            Update your name, phone and email
          </SheetDescription>
        </SheetHeader>
        <ProfileForm onSaved={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
