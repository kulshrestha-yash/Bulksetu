"use client";

// Hash-based router: gives the single-route sandbox a real multi-page feel —
// every view is deep-linkable (#/products?category=...), back/forward work,
// and the same build deploys anywhere without a server rewrite layer.
import { useCallback, useEffect, useState } from "react";

export interface Route {
  /** e.g. "/", "/products", "/product/basmati-rice", "/order/BS-2026-00847" */
  path: string;
  segments: string[];
  query: URLSearchParams;
  full: string;
}

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart] = raw.split("?");
  const path = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
  const segments = path.split("/").filter(Boolean).map(decodeURIComponent);
  return { path, segments, query: new URLSearchParams(queryPart || ""), full: raw };
}

export function navigate(to: string, opts?: { replace?: boolean }) {
  const target = `#${to.startsWith("/") ? to : `/${to}`}`;
  if (opts?.replace) {
    window.history.replaceState(null, "", target);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = target;
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === "undefined"
      ? { path: "/", segments: [], query: new URLSearchParams(), full: "/" }
      : parseHash()
  );

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

/** programmatic navigation that also works in callbacks */
export function useNavigate() {
  return useCallback((to: string, opts?: { replace?: boolean }) => navigate(to, opts), []);
}
