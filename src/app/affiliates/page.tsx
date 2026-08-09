import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  Link2,
  Shield,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/content/page-hero";
import { Breadcrumb } from "@/components/content/breadcrumb";
import { SITE_NAME } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partner Program",
  description:
    "Join the OVIPeps Partner Program. Earn commission promoting research-grade peptides to qualified laboratories across Canada.",
};

const benefits = [
  {
    icon: BadgeDollarSign,
    title: "Competitive commission",
    description:
      "Earn a percentage on every qualifying order placed through your unique referral link. Commissions are calculated on the commissionable subtotal after discounts.",
  },
  {
    icon: Link2,
    title: "Simple tracking",
    description:
      "Get a personal referral code and shareable URL. Our 30-day attribution window ensures you receive credit when researchers return to complete their purchase.",
  },
  {
    icon: BarChart3,
    title: "Transparent dashboard",
    description:
      "Monitor clicks, conversions, commissions, and payouts in real time from your affiliate dashboard — no guessing about performance.",
  },
  {
    icon: Shield,
    title: "Trusted Canadian brand",
    description:
      "Promote a supplier known for COA documentation, domestic fulfillment, and research-use-only product communication that aligns with responsible outreach.",
  },
];

const steps = [
  {
    step: "01",
    title: "Apply",
    description:
      "Tell us about your audience, platform, and how you plan to introduce OVIPeps to qualified researchers.",
  },
  {
    step: "02",
    title: "Get approved",
    description:
      "Our team reviews applications within 3–5 business days. Approved partners receive a unique referral code and dashboard access.",
  },
  {
    step: "03",
    title: "Share your link",
    description:
      "Distribute your referral URL across your channels. Clicks and orders are tracked automatically.",
  },
  {
    step: "04",
    title: "Earn commission",
    description:
      "Commissions move from Pending to Approved after payment confirmation, then are paid monthly for qualifying earnings.",
  },
];

export default function AffiliatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner Program"
        title="Earn with OVIPeps"
        description={`Partner with ${SITE_NAME} and earn commission by connecting qualified researchers with research-grade peptides backed by documentation and Canadian fulfillment.`}
      >
        <div className="flex flex-wrap gap-4">
          <Link
            href="/affiliates/apply"
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-navy-deep"
          >
            Apply now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/affiliates/terms"
            className="inline-flex h-12 items-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Program terms
          </Link>
        </div>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Partner Program" },
          ]}
          className="mb-10"
        />

        <section>
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">
              Why partner with us
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-navy-deep">
              Program benefits
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy/5 text-navy">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">
              Getting started
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-navy-deep">
              How it works
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl border border-border bg-muted/20 p-6"
              >
                <span className="text-3xl font-semibold text-teal/30">
                  {item.step}
                </span>
                <h3 className="mt-3 font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-8 rounded-2xl border border-border bg-gradient-to-br from-navy/5 via-card to-teal/5 p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal/10 text-teal">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-navy-deep">
              Who should apply?
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              We work with content creators, educators, and publishers who reach
              qualified laboratory and research audiences. Partners must promote
              OVIPeps accurately — emphasizing research-use-only classification
              and never making medical or therapeutic claims.
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                Science communicators and research educators
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                Laboratory procurement blogs and newsletters
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                Canadian research community publishers
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                Podcast and video creators with qualified audiences
              </li>
            </ul>
            <Link
              href="/affiliates/apply"
              className="mt-8 inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-navy-deep"
            >
              Start your application
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
