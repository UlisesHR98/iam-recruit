import { Topbar } from "@/components/ui/topbar";
import { NAV_ITEMS } from "@/lib/nav-items";
import ProtectedClient from "@/components/auth/protected-client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Topbar
        logo={<span className="font-semibold">Mi App</span>}
        navItems={NAV_ITEMS}
      />
      <div className="flex-1 overflow-y-auto">
        <ProtectedClient>{children}</ProtectedClient>
      </div>
    </div>
  );
}
