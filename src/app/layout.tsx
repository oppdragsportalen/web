import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oppdragsportalen",
  description: "Digital løsning for oppdragsbestilling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-100 text-gray-900 dark:bg-black dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
