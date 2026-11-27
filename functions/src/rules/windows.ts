export const KNOCK_WINDOWS = [5, 15, 60] as const;

export type KnockWindow = (typeof KNOCK_WINDOWS)[number];

export const DEFAULT_KNOCK_WINDOW: KnockWindow = 15;

export function isKnockWindow(n: unknown): n is KnockWindow {
  return KNOCK_WINDOWS.some((w) => w === n);
}
