"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

interface NewsletterProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function Newsletter({
  title = "Get OVIpeps updates",
  subtitle = "Join our email list for inventory announcements, documentation updates, and Canadian fulfillment news.",
  className,
}: NewsletterProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email") }) });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  }
  return (
    <section className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 gradient-primary animate-gradient" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggIGQ9Ik0zNiAzNGg0djJoLTR6bTAtNEg0MHYyaC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

            <motion.div
              className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-bright/20 blur-3xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />

            <div className="relative px-8 py-14 sm:px-16 sm:py-20">
              <div className="mx-auto max-w-xl text-center">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg backdrop-blur-sm"
                >
                  <Mail className="h-7 w-7" />
                </motion.div>

                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                  <Sparkles className="h-3 w-3" />
                  Email updates
                </div>

                <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
                <p className="mt-3 text-base leading-relaxed text-white/80">{subtitle}</p>

                <form onSubmit={subscribe} className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
                  <input name="email" type="email" required aria-label="Email address" placeholder="you@example.com" className="min-w-0 flex-1 rounded-xl border border-white/25 bg-white px-5 py-4 text-sm text-navy-deep outline-none ring-cyan-bright focus:ring-2" />
                  <button type="submit" disabled={status === "loading"} className="rounded-xl bg-navy-deep px-7 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-navy disabled:opacity-60">{status === "loading" ? "Joining…" : "Join the list"}</button>
                </form>
                {status === "success" && <p className="mt-3 text-sm font-semibold text-white">You’re on the list—thank you!</p>}
                {status === "error" && <p className="mt-3 text-sm font-semibold text-white">We couldn’t add you yet. Please try again shortly.</p>}

                <p className="mt-5 text-xs text-white/55">
                  Unsubscribe anytime. Products are for laboratory research purposes only.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
