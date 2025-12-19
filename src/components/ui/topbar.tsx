"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Home, Briefcase, FileText, Settings } from "lucide-react";

const ICON_MAP = {
  home: Home,
  briefcase: Briefcase,
  "file-text": FileText,
  settings: Settings,
};

import { useTopbar } from "@/hooks/use-topbar";
import type { NavItem } from "@/lib/types";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useLogout } from "@/hooks/use-logout";
import { useUser } from "@/hooks/use-user";

interface TopbarProps {
  logo?: React.ReactNode;
  navItems: NavItem[];
  rightContent?: React.ReactNode;
  className?: string;
}

export function Topbar({
  logo,
  navItems,
  rightContent,
  className,
}: TopbarProps) {
  const pathname = usePathname();
  const { isScrolled, mobileOpen, closeMobile, setMobileOpen } = useTopbar();
  const { logout } = useLogout();
  const { user } = useUser();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-topbar",
        isScrolled && "shadow-sm",
        className
      )}
    >
      <div className="flex h-14 sm:h-16 w-full items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">{logo}</div>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon ? ICON_MAP[item.icon] : null;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Button
                key={item.id}
                variant={active ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "gap-2",
                  active &&
                    "bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 dark:bg-brand-orange/20 dark:text-brand-orange dark:hover:bg-brand-orange/30"
                )}
                asChild
              >
                <Link href={item.href}>
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {rightContent}

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex h-9 w-9 rounded-full border border-border hover:bg-accent"
              >
                <User className="h-4 w-4" />
                <span className="sr-only">Abrir menú de usuario</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user?.email && (
                <>
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                  <Separator />
                </>
              )}
              <DropdownMenuItem
                onClick={logout}
                variant="destructive"
                className="cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-4">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              {user?.email && (
                <div className="mt-6 mb-4 px-2 py-2 rounded-md bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Usuario</p>
                  <p className="text-sm font-medium text-foreground">
                    {user.email}
                  </p>
                </div>
              )}
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon ? ICON_MAP[item.icon] : null;
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Button
                      key={item.id}
                      variant={active ? "secondary" : "ghost"}
                      className={cn(
                        "justify-start gap-3",
                        active &&
                          "bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 dark:bg-brand-orange/20 dark:text-brand-orange dark:hover:bg-brand-orange/30"
                      )}
                      asChild
                    >
                      <Link href={item.href} onClick={closeMobile}>
                        {Icon && <Icon className="h-4 w-4" />}
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  className="justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
                  onClick={() => {
                    closeMobile();
                    logout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
