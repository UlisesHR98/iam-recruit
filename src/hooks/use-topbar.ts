"use client";

import { useState, useEffect, useCallback } from "react";

export function useTopbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const setMobileOpenState = useCallback((open: boolean) => {
    setMobileOpen(open);
  }, []);

  return {
    mobileOpen,
    isScrolled,
    toggleMobile,
    closeMobile,
    setMobileOpen: setMobileOpenState,
  };
}
