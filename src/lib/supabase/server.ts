import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServer() {
  const cookieStore = await cookies();

  const trySet = (name: string, value: string, options: any) => {
    try {
      const setter = (cookieStore as any).set;
      if (typeof setter === "function") {
        setter.call(cookieStore, { name, value, ...options });
      }
    } catch (e) {}
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          trySet(name, value, options);
        },
        remove(name: string, options: any) {
          trySet(name, "", options);
        },
      },
    }
  );
}
