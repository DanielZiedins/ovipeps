import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AffiliateTracker } from "@/components/affiliate-tracker";
import { Providers } from "@/components/providers";
import { SITE_NAME, SITE_URL } from "@/lib/content";
import { getAnnouncements } from "@/lib/safe-db";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Research-Grade Peptides`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Premium research-grade peptides and laboratory supplies. Third-party tested, COA-documented, and fulfilled from within Canada.",
  keywords: [
    "research peptides",
    "laboratory peptides",
    "COA peptides",
    "Canadian peptide supplier",
    "research compounds",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Research-Grade Peptides`,
    description:
      "Premium research-grade peptides and laboratory supplies. Third-party tested, COA-documented, and fulfilled from within Canada.",
    images: [
      {
        url: "/images/brand/logo.png",
        alt: `${SITE_NAME} logo`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — Research-Grade Peptides`,
    description:
      "Premium research-grade peptides and laboratory supplies. Third-party tested, COA-documented, and fulfilled from within Canada.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/brand/logo.png`,
  description:
    "Canadian supplier of research-grade peptides and laboratory supplies for qualified research professionals.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@ovipeps.ca",
    contactType: "customer support",
    areaServed: "CA",
    availableLanguage: "English",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const announcements = await getAnnouncements();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <AnnouncementBar announcements={announcements} />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AffiliateTracker />
        </Providers>
      </body>
    </html>
  );
}
