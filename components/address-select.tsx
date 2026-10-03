"use client";

import { useMemo } from "react";
import AsyncSelect from "react-select/async";
import type { SingleValue } from "react-select";

type AddressOption = {
  label: string;
  value: string;
};

async function fetchAddressOptions(text: string): Promise<AddressOption[]> {
  if (!text.trim()) return [];

  const response = await fetch(
    `/api/geocode?text=${encodeURIComponent(text)}`,
  );
  if (!response.ok) return [];

  const data = await response.json();

  return (data.results ?? []).map(
    (result: { formatted: string; place_id: string }) => ({
      label: result.formatted,
      value: result.formatted,
    }),
  );
}

function debounce<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  delayMs: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Args): Promise<Result> =>
    new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => resolve(fn(...args)), delayMs);
    });
}

export function AddressSelect({
  value,
  onChange,
  placeholder = "Select delivery address",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const loadOptions = useMemo(() => debounce(fetchAddressOptions, 300), []);

  const selectedOption = useMemo<AddressOption | null>(
    () => (value ? { label: value, value } : null),
    [value],
  );

  return (
    <AsyncSelect
      instanceId="address-select"
      value={selectedOption}
      onChange={(option: SingleValue<AddressOption>) =>
        onChange(option?.value ?? "")
      }
      loadOptions={loadOptions}
      placeholder={placeholder}
      noOptionsMessage={({ inputValue }) =>
        inputValue ? "No addresses found" : "Start typing an address"
      }
      unstyled
      classNames={{
        control: () =>
          "border-none bg-transparent shadow-none min-h-0 cursor-text flex-nowrap",
        valueContainer: () => "p-0 flex-nowrap",
        input: () => "text-base font-medium text-foreground m-0 p-0",
        placeholder: () =>
          "text-base font-medium text-foreground m-0 truncate",
        singleValue: () =>
          "text-base font-medium text-foreground m-0 truncate",
        indicatorsContainer: () => "hidden",
        menu: () =>
          "mt-2 rounded-xl border border-border bg-background shadow-lg overflow-hidden z-50",
        menuList: () => "py-1",
        option: ({ isFocused, isSelected }) =>
          `px-3 py-2 text-sm cursor-pointer ${
            isSelected
              ? "bg-primary text-primary-foreground"
              : isFocused
                ? "bg-muted"
                : ""
          }`,
        loadingMessage: () => "px-3 py-2 text-sm text-muted-foreground",
        noOptionsMessage: () => "px-3 py-2 text-sm text-muted-foreground",
      }}
    />
  );
}
