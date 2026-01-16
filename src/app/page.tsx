import { Card } from "@radix-ui/themes";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex justify-center py-16 p-4 min-w-80">
      <Card size="5" className="flex w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start rounded-2xl">
        <div className="flex flex-col gap-16 text-base font-medium sm:flex-row">
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Oppdragsportalen
            </h1>
          </div>
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <a
              className="flex h-12 w-full min-w-30 items-center justify-center gap-2 rounded-full bg-black dark:bg-white  px-5 text-white dark:text-black transition-colors hover:bg-[#212121] dark:hover:bg-[#ccc] md:w-39.5"
              href="/login"
              rel="noopener noreferrer"
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={16}
                height={16}
              />
              Log in
            </a>
            <a
              className="flex h-12 w-full min-w-30 items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-5 text-white dark:text-black transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-39.5"
              href="/signup"
              rel="noopener noreferrer"
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={16}
                height={16}
              />
              Sign up
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
