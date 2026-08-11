"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  ChevronDown,
  FileCheck,
  FlaskConical,
  HelpCircle,
  Menu,
  Microscope,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  User,
  X,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { MegaMenu } from "./mega-menu";
import { CartDrawer } from "./cart-drawer";
import { SearchModal } from "./search-modal";
import { BrandMark } from "./brand-mark";

const shopSections = [
  {
    title: "Browse",
    links: [
      {
        label: "All Products",
        href: "/shop",
        description: "Full catalog of research materials",
        icon: Package,
      },
      {
        label: "Featured",
        href: "/shop?filter=featured",
        description: "Top picks from our lab",
        icon: Star,
      },
      {
        label: "New Arrivals",
        href: "/shop?filter=new",
        description: "Latest additions to our catalog",
        icon: Sparkles,
      },
    ],
  },
  {
    title: "Categories",
    links: [
      {
        label: "Research Peptides",
        href: "/shop?category=research-peptides",
        description: "High-purity peptide compounds",
        icon: FlaskConical,
      },
      {
        label: "Lab Supplies",
        href: "/shop?category=supplies",
        description: "Reconstitution and handling tools",
        icon: Microscope,
      },
      {
        label: "Bundles",
        href: "/shop?category=bundles",
        description: "Curated research kits",
        icon: Package,
      },
    ],
  },
];

const researchSections = [
  {
    title: "Learn",
    links: [
      {
        label: "Research Hub",
        href: "/research",
        description: "Guides, articles, and resources",
        icon: BookOpen,
      },
      {
        label: "Peptides 101",
        href: "/research/peptides-101-introduction",
        description: "Introduction to peptide research",
        icon: FlaskConical,
      },
      {
        label: "Understanding COAs",
        href: "/research/understanding-coas",
        description: "How to read certificates of analysis",
        icon: FileCheck,
      },
      {
        label: "Storage & Handling",
        href: "/research/storage-handling",
        description: "Best practices for lab storage",
        icon: Microscope,
      },
    ],
  },
  {
    title: "Tools",
    links: [
      {
        label: "Lab Results",
        href: "/lab-results",
        description: "Batch testing documentation",
        icon: FileCheck,
      },
      {
        label: "Reconstitution Calculator",
        href: "/calculator",
        description: "Calculate dilution volumes",
        icon: Calculator,
      },
      {
        label: "FAQ",
        href: "/research/faq",
        description: "Common research questions",
        icon: HelpCircle,
      },
    ],
  },
];

const mobileNavLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Research Hub", href: "/research" },
  { label: "Lab Results", href: "/lab-results" },
  { label: "Calculator", href: "/calculator" },
  { label: "Account", href: "/account" },
];

export function Header() {
  const [shopOpen, setShopOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileResearchOpen, setMobileResearchOpen] = useState(false);

  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const closeMenus = () => {
    setShopOpen(false);
    setResearchOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "glass border-b border-sky/10 shadow-lg shadow-sky/10"
            : "bg-white/80 backdrop-blur-xl"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-foreground transition-colors hover:bg-secondary lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="relative flex shrink-0 items-center">
              <BrandMark size="sm" />
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={closeMenus}>
            <MegaMenu
              label="Shop"
              sections={shopSections}
              featured={{
                title: "Research-Grade Quality",
                description:
                  "Research products with published batch documentation clearly identified where available.",
                href: "/shop?filter=featured",
                cta: "Shop Featured",
              }}
              isOpen={shopOpen}
              onOpen={() => {
                setResearchOpen(false);
                setShopOpen(true);
              }}
              onClose={() => setShopOpen(false)}
            />
            <MegaMenu
              label="Research Hub"
              sections={researchSections}
              featured={{
                title: "Peptides 101",
                description:
                  "New to peptide research? Start with our comprehensive introduction guide.",
                href: "/research/peptides-101-introduction",
                cta: "Start Learning",
              }}
              isOpen={researchOpen}
              onOpen={() => {
                setShopOpen(false);
                setResearchOpen(true);
              }}
              onClose={() => setResearchOpen(false)}
            />
            <Link
              href="/lab-results"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-navy"
            >
              Lab Results
            </Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-md p-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-navy"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/account"
              className="hidden rounded-md p-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-navy sm:block"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            <button
              type="button"
              onClick={openCart}
              className="relative rounded-md p-2 text-foreground/80 transition-colors hover:bg-secondary hover:text-navy"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-gradient-to-r from-sky to-cyan px-1 text-[10px] font-bold text-white shadow-md shadow-sky/30 animate-bounce-subtle">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-navy-deep/40 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />
        <nav
          className={cn(
            "absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-card shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <BrandMark size="sm" />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Shop
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    mobileShopOpen && "rotate-180"
                  )}
                />
              </button>
              {mobileShopOpen && (
                <div className="ml-3 space-y-1 border-l border-border pl-3">
                  {shopSections.flatMap((s) => s.links).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setMobileResearchOpen(!mobileResearchOpen)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Research Hub
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    mobileResearchOpen && "rotate-180"
                  )}
                />
              </button>
              {mobileResearchOpen && (
                <div className="ml-3 space-y-1 border-l border-border pl-3">
                  {researchSections.flatMap((s) => s.links).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              {mobileNavLinks.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-border px-4 py-4">
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <User className="h-4 w-4" />
              Account
            </Link>
          </div>
        </nav>
      </div>

      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
