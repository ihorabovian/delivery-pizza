import { useSyncExternalStore } from "react";

type PersistApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (listener: () => void) => () => void;
};

// Persisted stores use skipHydration and are restored after mount
// (see StoreRehydrate); false until then, so the first render matches SSR.
export function useHydrated(persist: PersistApi) {
  return useSyncExternalStore(
    persist.onFinishHydration,
    persist.hasHydrated,
    () => false,
  );
}
