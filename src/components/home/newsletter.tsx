"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Mail, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

interface NewsletterProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function Newsletter({
  title = "Get 10% Off Your First Order",
  subtitle = "Join our research community for new compound drops, batch updates, and exclusive offers.",
  className,
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl">
            {/* Animated gradient background */}
            <div className="absolute inset-0 gradient-primary animate-gradient" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggIGQ9Ik0zNiAzNGg0djJoLTR6bTAtNEg0MHYyaC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

            {/* Floating orbs */}
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
                  <Gift className="h-7 w-7" />
                </motion.div>

                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                  <Sparkles className="h-3 w-3" />
                  Exclusive Offer
                </div>

                <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
                <p className="mt-3 text-base leading-relaxed text-white/80">{subtitle}</p>

                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-8 rounded-2xl border border-white/30 bg-white/15 px-6 py-5 backdrop-blur-sm"
                  >
                    <p className="text-base font-semibold text-white">
                      🎉 You&apos;re in! Check your inbox for your discount code.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        aria-label="Email address"
                        className="w-full rounded-xl border border-white/20 bg-white/15 py-4 pl-11 pr-4 text-sm text-white placeholder:text-white/50 backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-navy-deep shadow-lg transition-shadow hover:shadow-xl"
                    >
                      Get My Code
                      <Send className="h-4 w-4" />
                    </motion.button>
                  </form>
                )}

                <p className="mt-4 text-xs text-white/50">
                  For research professionals only. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
