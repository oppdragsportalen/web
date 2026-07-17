import { Navbar } from "@/app/components/navbar";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased h-dvh flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-scroll">{children}</div>
    </div>
  );
}
