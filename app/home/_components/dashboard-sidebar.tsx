"use client";

import {
  BarChart3,
  Building2,
  LayoutDashboard,
  LogOut,
  Plus,
  Radio,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Monitoramento", icon: Radio },
  { label: "Relatórios", icon: BarChart3 },
  { label: "Empresas", icon: Building2 },
  { label: "Configurações", icon: Settings },
];

type DashboardSidebarProps = {
  onNewMonitoring: () => void;
  onLogout: () => void;
};

export function DashboardSidebar({
  onNewMonitoring,
  onLogout,
}: DashboardSidebarProps) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            MonitoraCNPJ
          </h1>
          <p className="text-xs text-muted-foreground">Enterprise SaaS</p>
        </div>

        <Button
          className="h-10 w-full justify-center gap-2 rounded-lg bg-foreground text-background hover:bg-foreground/90"
          onClick={onNewMonitoring}
        >
          <Plus className="size-4" />
          Novo Monitoramento
        </Button>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                item.active
                  ? "bg-[#1a73e8] text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-border p-6">
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
