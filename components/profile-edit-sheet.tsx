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
import { updateProfile } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import type { UpdateProfileRequest } from "@/types/auth";

const FIELDS = [
  {
    name: "firstname",
    label: "First name",
    type: "text",
    autoComplete: "given-name",
  },
  {
    name: "middlename",
    label: "Middle name",
    type: "text",
    autoComplete: "additional-name",
  },
  {
    name: "lastname",
    label: "Last name",
    type: "text",
    autoComplete: "family-name",
  },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "city", label: "City", type: "text", autoComplete: "address-level2" },
] as const;

const inputClassName =
  "w-full rounded-full border border-border bg-background px-4 py-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:text-muted-foreground";

// Mounted only while the sheet is open, so it starts from the saved profile each time
function ProfileForm({ onSaved }: { onSaved: () => void }) {
  const user = useAuthStore((state) => state.user);
  const [values, setValues] = useState(() =>
    Object.fromEntries(FIELDS.map(({ name }) => [name, user?.[name] ?? ""])),
  );
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { token, setUser } = useAuthStore.getState();
    if (!token || pending) return;

    // The API rejects empty values, so only filled fields are sent
    const profile: UpdateProfileRequest = {};
    for (const { name } of FIELDS) {
      const value = values[name].trim();
      if (value) profile[name] = value;
    }

    setPending(true);
    try {
      setUser(await updateProfile(token, profile));
      toast.success("Details updated");
      onSaved();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 px-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="profile-phone" className="text-sm">
          Phone
        </label>
        <input
          id="profile-phone"
          type="tel"
          value={user?.phone ?? ""}
          disabled
          className={inputClassName}
        />
      </div>

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
        size="xl"
        disabled={pending}
        className="mt-4 w-full"
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
            Update your name, email and city
          </SheetDescription>
        </SheetHeader>
        <ProfileForm onSaved={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
