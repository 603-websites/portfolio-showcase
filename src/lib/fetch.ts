/**
 * Graceful degradation helpers for third-party service calls.
 */

export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Operation timed out after ${ms}ms`);
    this.name = "TimeoutError";
  }
}

/**
 * Races a promise against a timeout.
 * If the promise does not resolve within `ms` milliseconds, rejects with a
 * TimeoutError so callers can return a friendly error response.
 *
 * Usage:
 *   const session = await withTimeout(stripe.checkout.sessions.create(...), 10_000);
 */
export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(ms)), ms);
  });

  try {
    const result = await Promise.race([promise, timeout]);
    clearTimeout(timer!);
    return result;
  } catch (err) {
    clearTimeout(timer!);
    throw err;
  }
}
