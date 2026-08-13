import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neve's Task Garden",
  description: "A personal school and shift to-do tracker for Neve R. Palmeri.",
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
