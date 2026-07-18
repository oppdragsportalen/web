import { Box } from "@radix-ui/themes";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col antialiased">
      <Navbar />
      <Box className="absolute inset-0 -z-20 bg-linear-to-tr from-blue-500/10 via-orange-500/5 to-emerald-400/15 blur-3xl" />
      <Box className="absolute inset-0 -z-10 bg-transparent dark:bg-black/40" />
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Error 404
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-5xl font-bold">
            The page you’re looking for can’t be found.
          </h1>
        </div>
      </main>
      <Footer />
    </div>
  );
}
