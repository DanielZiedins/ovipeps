"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart";

const AFFILIATE_COOKIE = "ovipeps-affiliate";
const AFFILIATE_STORAGE = "ovipeps-affiliate";
const ATTRIBUTION_DAYS = 30;

function setAffiliateCookie(code: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + ATTRIBUTION_DAYS);
  document.cookie = `${AFFILIATE_COOKIE}=${encodeURIComponent(code)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

function AffiliateTrackerInner() {
  const searchParams = useSearchParams();
  const setAffiliateCode = useCartStore((s) => s.setAffiliateCode);

  useEffect(() => {
    const ref = searchParams.get("r");
    if (!ref) return;

    const code = ref.trim().toUpperCase();
    if (!code) return;

    try {
      localStorage.setItem(AFFILIATE_STORAGE, code);
    } catch {
      // localStorage may be unavailable in private browsing
    }

    setAffiliateCookie(code);
    setAffiliateCode(code);

    fetch("/api/affiliates/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        referrer: document.referrer || undefined,
        landingPage: window.location.pathname,
      }),
    }).catch(() => {
      // tracking should not block page load
    });
  }, [searchParams, setAffiliateCode]);

  useEffect(() => {
    const ref = searchParams.get("r");
    if (ref) return;

    try {
      const stored = localStorage.getItem(AFFILIATE_STORAGE);
      if (stored) {
        setAffiliateCode(stored);
        return;
      }
    } catch {
      // ignore
    }

    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${AFFILIATE_COOKIE}=`));

    if (match) {
      const code = decodeURIComponent(match.split("=")[1] ?? "");
      if (code) setAffiliateCode(code);
    }
  }, [searchParams, setAffiliateCode]);

  return null;
}

export function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <AffiliateTrackerInner />
    </Suspense>
  );
}
