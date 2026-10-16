import React from 'react';

/**
 * Robust lazy loading wrapper with automatic retry mechanism.
 * Protects against temporary network drops, dev server restarts, and stale module chunk hashes.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T } | T>
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    let attempts = 0;
    while (attempts < 3) {
      attempts++;
      try {
        const mod: any = await factory();
        return mod?.default ? mod : { default: mod };
      } catch (err: any) {
        if (attempts < 3) {
          // Wait briefly before retrying the dynamic import
          await new Promise((resolve) => setTimeout(resolve, 350 * attempts));
          continue;
        }
        console.warn('[lazyWithRetry] Module failed after 3 attempts:', err?.message || err);
        throw err;
      }
    }
    return (await factory()) as any;
  });
}
