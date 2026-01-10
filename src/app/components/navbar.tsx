import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";

export async function Navbar() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const displayName = profile?.display_name ?? user?.email ?? null;

  return (
    <nav className="bg-white dark:bg-neutral-900 border-b border-gray-300 dark:border-neutral-800 h-12 flex items-center justify-between gap-4 p-2 overflow-x-scroll overflow-y-hidden">
      <div>
        <Link
          href="/"
          className="text-lg font-semibold hover:text-emerald-800 cursor-pointer"
        >
          Oppdragsportalen
        </Link>
      </div>

      {user && displayName && (
        <div className="flex items-center gap-2">
          <p className="text-sm">{displayName}</p>
          <div className="w-8 h-8 bg-emerald-800 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </nav>
  );
}
