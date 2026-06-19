import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True only once the client has hydrated. Lets components render an
 * SSR-safe placeholder for client-only state (theme, localStorage) without
 * the effect+setState pattern — useSyncExternalStore's server/client
 * snapshot split is the supported way to diverge post-hydration.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
