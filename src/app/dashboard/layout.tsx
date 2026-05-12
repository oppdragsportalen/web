import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/sidebar";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, username, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden min-w-md">
      <SidebarProvider>
        <AppSidebar profile={profile} />
        <div className="flex-1 overflow-auto -ml-16 pl-16 z-0">{children}</div>
      </SidebarProvider>
    </div>
  );
}
