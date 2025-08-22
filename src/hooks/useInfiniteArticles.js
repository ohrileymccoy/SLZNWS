import { useCallback, useEffect, useRef, useState } from "react";
import { fetchArticles } from "../api/client";
import { loadFeedState, saveFeedState, clearFeedState } from "../utils/scroll-restore";

/**
 * Infinite articles hook (Phase 7)
 * - Sentinel-driven loading
 * - Single-flight + cooldown + distance guard
 * - End condition (nextCursor=null)
 * - Offline/error handling with Retry
 * - Back-to-feed scroll + items restore
 */
export function useInfiniteArticles({ section = null, pageSize = 20 }) {
  // Use a single snapshot read to avoid parsing sessionStorage multiple times.
  const restoredRef = useRef(loadFeedState());

  // Data
  const [items, setItems] = useState(() => restoredRef.current?.items ?? []);
  // `cursor` here means "the next cursor to request" (null on first load).
  const [cursor, setCursor] = useState(() => restoredRef.current?.cursor ?? null);

  // UI state: "idle" | "loading" | "error" | "end"
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  // Dedup across pages
  const idSetRef = useRef(new Set(items.map(i => i.id)));

  // Guards
  const inflightRef = useRef(null); // AbortController or null
  const lastTriggerTsRef = useRef(0);
  const lastTriggerScrollYRef = useRef(0);
  const MIN_TRIGGER_GAP_MS = 300;
  const MIN_TRIGGER_GAP_PX = 350;

  // End condition flag
  const [isEnd, setIsEnd] = useState(false);

  // Online/offline awareness
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  // Reset when section changes
  useEffect(() => {
    idSetRef.current = new Set();
    setItems([]);
    setCursor(null);
    setIsEnd(false);
    setStatus("idle");
    setError(null);
    clearFeedState();
  }, [section]);

  const canTrigger = useCallback(() => {
    if (status !== "idle") return false;
    if (isEnd) return false;
    if (!online) return false;

    const now = Date.now();
    if (now - lastTriggerTsRef.current < MIN_TRIGGER_GAP_MS) return false;

    const dy = Math.abs(window.scrollY - lastTriggerScrollYRef.current);
    if (dy < MIN_TRIGGER_GAP_PX) return false;

    return true;
  }, [status, isEnd, online]);

  const loadMore = useCallback(async () => {
    if (!canTrigger()) return;
    if (inflightRef.current) return; // single-flight guard

    // Mark trigger point
    lastTriggerTsRef.current = Date.now();
    lastTriggerScrollYRef.current = window.scrollY;

    setStatus("loading");
    setError(null);

    const ac = new AbortController();
    inflightRef.current = ac;

    try {
      const res = await fetchArticles({
        cursor,                    // null for first page
        limit: pageSize,
        section,
        signal: ac.signal
      });

      const added = [];
      for (const it of res.items ?? []) {
        if (!idSetRef.current.has(it.id)) {
          idSetRef.current.add(it.id);
          added.push(it);
        }
      }

      setItems(prev => {
        const merged = [...prev, ...added];
        // Persist snapshot for back-navigation
        saveFeedState({ scrollY: window.scrollY, cursor: res.nextCursor ?? null, items: merged });
        return merged;
      });

      if (res.nextCursor == null) {
        setCursor(null);
        setIsEnd(true);
        setStatus("end");
      } else {
        setCursor(res.nextCursor);
        setStatus("idle");
      }
    } catch (err) {
      if (!ac.signal.aborted) {
        setError(err instanceof Error ? err.message : "Failed to load");
        setStatus("error");
      }
    } finally {
      inflightRef.current = null;
    }
  }, [canTrigger, cursor, pageSize, section]);

  const retry = useCallback(() => {
    if (!online) return;
    setStatus("idle");
    setError(null);
    loadMore();
  }, [online, loadMore]);

  // On mount, restore scroll position (if any) after first paint
  useEffect(() => {
    const restored = restoredRef.current;
    if (restored && typeof restored.scrollY === "number") {
      requestAnimationFrame(() => {
        window.scrollTo({ top: restored.scrollY, behavior: "auto" });
      });
    }
  }, []);

  return {
    items,
    status,
    error,
    isEnd,
    online,
    loadMore,
    retry
  };
}
