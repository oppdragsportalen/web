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
        <div className="hidden max-md:block fixed top-0 z-50 h-12 w-full border-b border-gray-200 bg-(--color-background) dark:border-neutral-800">
          <div className="flex items-center h-full pl-4">
            <SidebarTrigger />
          </div>
        </div>
        <div className="flex-1 overflow-auto -ml-16 pl-16 z-0 max-md:pt-12">
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}
