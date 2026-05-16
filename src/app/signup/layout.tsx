import { Navbar } from "@/app/components/navbar";

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-scroll">{children}</div>
    </div>
  );
}
