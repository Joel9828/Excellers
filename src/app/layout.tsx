import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";

/**
 * Type per the brand guide (pp. 16–21), as reconciled in the master layout:
 * Constantia is the primary corporate face but is not web-licensed, so
 * Source Serif 4 carries the display role and Constantia is kept first in the
 * CSS stack for anyone who has it locally. Inter is the body face.
 */
const display = Source_Serif_4({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const body = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://excellers.co"),
  title: {
    default: "EXCELLERS — Business transformation consultancy",
    template: "%s · EXCELLERS",
  },
  description:
    "EXCELLERS is a business transformation consultancy working across strategy, operations, people, technology and AI, from Islamabad, Maryland and London. We Manifest.",
  keywords: [
    "business transformation",
    "management consultancy",
    "operations",
    "customer experience",
    "AI and automation",
    "Excellers",
  ],
  openGraph: {
    title: "EXCELLERS — Business transformation consultancy",
    description: "Business transformation, from the first question to lasting change. We Manifest™.",
    url: "https://excellers.co",
    siteName: "Excellers",
    images: ["/brand/symbol-512.png"],
    type: "website",
  },
  icons: {
    icon: "/brand/symbol-512.png",
    apple: "/brand/symbol-512.png",
  },
};

export const viewport: Viewport = {
  // The canvas is white. Declaring a dark scheme here made browser chrome
  // and OS dark mode disagree with the page — flagged in the master layout
  // audit of the live site.
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
