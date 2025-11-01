"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  Store,
  UtensilsCrossed,
  Bus,
  Calendar,
  Percent,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Kategoriler",
    href: "/categories",
    icon: Tag,
  },
  {
    label: "Mekanlar",
    href: "/venues",
    icon: Store,
  },
  {
    label: "Menü Ürünleri",
    href: "/menu-items",
    icon: UtensilsCrossed,
  },
  {
    label: "Hizmetler",
    href: "/services",
    icon: Bus,
  },
  {
    label: "Etkinlikler",
    href: "/events",
    icon: Calendar,
  },
  {
    label: "Fırsatlar",
    href: "/deals",
    icon: Percent,
  },
  {
    label: "Ayarlar",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">Kötekli Admin</h1>
        <p className="text-sm text-gray-400 mt-1">Yönetim Paneli</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
