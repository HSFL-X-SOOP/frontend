import { useEffect, useRef } from "react";

type IntervalCallback = () => void | Promise<void>;

interface UseIntervalCallbackOptions {
  delay: number;
  immediate?: boolean;
  enabled?: boolean;
}

export function useIntervalCallback(
  callback: IntervalCallback,
  { delay, immediate = true, enabled = true }: UseIntervalCallbackOptions
) {
  const callbackRef = useRef<IntervalCallback>(callback);
  const runningRef = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = async () => {
      if (runningRef.current) return;
      runningRef.current = true;

      try {
        await callbackRef.current();
      } finally {
        runningRef.current = false;
        timeoutId = setTimeout(tick, delay);
      }
    };

    if (immediate) {
      tick();
    } else {
      timeoutId = setTimeout(tick, delay);
    }

    return () => clearTimeout(timeoutId);
  }, [delay, immediate, enabled]);
}