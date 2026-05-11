import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 h-full overflow-hidden min-w-md">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 overflow-auto -ml-16 pl-16 z-0">{children}</div>
      </SidebarProvider>
    </div>
  );
}
