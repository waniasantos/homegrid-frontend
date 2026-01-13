// src/lib/useAsync.js
import { useCallback, useEffect, useRef, useState } from "react";

export function useAsync(fn, deps = []) {
  const mounted = useRef(true);

  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
    updatedAt: null,
  });

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fn();
      if (!mounted.current) return;
      setState({
        loading: false,
        error: null,
        data,
        updatedAt: data?.updatedAt || new Date().toISOString(),
      });
    } catch (error) {
      if (!mounted.current) return;
      setState((s) => ({
        ...s,
        loading: false,
        error,
        data: null,
      }));
    }
  }, deps);

  useEffect(() => {
    mounted.current = true;
    run();
    return () => {
      mounted.current = false;
    };
  }, [run]);

  return { ...state, reload: run };
}
