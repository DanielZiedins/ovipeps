import Link from "next/link";
import {
  Calculator,
  FileCheck,
  FlaskConical,
  HelpCircle,
  Mail,
  MapPin,
  Microscope,
  Package,
  Shield,
} from "lucide-react";

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "Featured", href: "/shop?filter=featured" },
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Research Peptides", href: "/shop?category=research-peptides" },
  { label: "Lab Supplies", href: "/shop?category=supplies" },
  { label: "Bundles", href: "/shop?category=bundles" },
];

const researchLinks = [
  { label: "Research Hub", href: "/research" },
  { label: "Peptides 101", href: "/research/peptides-101-introduction" },
  { label: "Understanding COAs", href: "/research/understanding-coas" },
  { label: "Storage & Handling", href: "/research/storage-handling" },
  { label: "Lab Results", href: "/lab-results" },
  { label: "Calculator", href: "/calculator" },
  { label: "FAQ", href: "/research/faq" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Research Disclaimer", href: "/research-disclaimer" },
];

const supportLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Account", href: "/account" },
  { label: "Affiliate Program", href: "/affiliates" },
];

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-teal-light"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-navy-deep via-navy to-sky/90 text-white">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 80%, rgba(6,182,212,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(14,165,233,0.2) 0%, transparent 50%)"
      }} />
      <div className="relative border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-lg font-semibold tracking-tight">OVIPeps</p>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Premium research-grade peptides and laboratory supplies. Third-party
              tested, COA-documented, and fulfilled from within Canada.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <MapPin className="h-4 w-4 shrink-0 text-teal-light" />
              <span className="text-sm font-medium text-white/80">
                Proudly Canadian — Ships from Canada
              </span>
            </div>
          </div>

          <FooterLinkGroup title="Shop" links={shopLinks} />
          <FooterLinkGroup title="Research Hub" links={researchLinks} />
          <FooterLinkGroup title="Legal" links={legalLinks} />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <FlaskConical className="h-4 w-4 text-teal-light" />
            </div>
            <div>
              <p className="text-sm font-medium">Research Use Only</p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                All products are sold for research purposes only. Not for human
                or veterinary consumption.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <Shield className="h-4 w-4 text-teal-light" />
            </div>
            <div>
              <p className="text-sm font-medium">Quality Assured</p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                Independent third-party testing with certificates of analysis
                available for every batch.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <Mail className="h-4 w-4 text-teal-light" />
            </div>
            <div>
              <p className="text-sm font-medium">Support</p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                <a
                  href="mailto:support@ovipeps.ca"
                  className="text-teal-light hover:underline"
                >
                  support@ovipeps.ca
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            &copy; {year} OVIPeps. All rights reserved. Prices in CAD.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {supportLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/50 transition-colors hover:text-teal-light"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 text-white/30">
            <Microscope className="h-4 w-4" />
            <Package className="h-4 w-4" />
            <FileCheck className="h-4 w-4" />
            <Calculator className="h-4 w-4" />
            <HelpCircle className="h-4 w-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
