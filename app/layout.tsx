import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canopy — Stories of Remarkable Trees",
  description: "Meet the remarkable trees standing watch around the world.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
