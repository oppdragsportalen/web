import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/navbar";

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
      <body className="antialiased bg-gray-100 text-gray-900 dark:bg-black dark:text-gray-100 h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-scroll">
          {children}
        </div>
      </body>
    </html>
  );
}
