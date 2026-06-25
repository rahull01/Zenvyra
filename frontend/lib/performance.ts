export function runWhenIdle(task: () => void, timeout = 500): void {
  if (typeof window === "undefined") {
    return;
  }

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(task, { timeout });
    return;
  }

  globalThis.setTimeout(task, 0);
}

export function runAfterPaint(task: () => void): void {
  if (typeof window === "undefined") {
    return;
  }

  window.requestAnimationFrame(() => {
    globalThis.setTimeout(task, 0);
  });
}
