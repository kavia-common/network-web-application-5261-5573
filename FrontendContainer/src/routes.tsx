import React from "react";

/**
 * PUBLIC_INTERFACE
 * useHashRouter
 * Minimal hash-based router to avoid extra dependencies.
 */
export function useHashRouter() {
  const [hash, setHash] = React.useState(() => window.location.hash || "#/");

  React.useEffect(() => {
    function onHashChange() {
      setHash(window.location.hash || "#/");
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // parse hash into path segments
  const path = hash.replace(/^#/, "") || "/";
  const segments = path.split("/").filter(Boolean);

  // PUBLIC_INTERFACE
  function navigate(to) {
    if (to.startsWith("#")) window.location.hash = to.slice(1);
    else window.location.hash = to;
  }

  return { hash, path, segments, navigate };
}
