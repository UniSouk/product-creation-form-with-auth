"use client";

import { redirect, usePathname } from "next/navigation";
import { LogOut, Plus, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import CompanLogo from "@/assets/images/brand_logo.svg"
import clsx from "clsx";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Create Product", icon: Plus, path: "/dashboard/product-create" },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-72 border-r border-gray-200 p-8 sticky top-0 h-screen overflow-y-auto flex flex-col bg-[#101828]">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white">
            <p>UNISOUK</p>
          </h2>
          <p className="text-xs text-gray-400 mt-1">Product Management</p>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                className={clsx(
                  "w-full text-left px-4 py-3 text-sm font-medium rounded-lg flex items-center gap-3 transition-all duration-200",
                  isActive
                    ? "bg-[#F75A27] text-white shadow-md hover:bg-[#e15123] hover:shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon
                  className={clsx(
                    "w-4 h-4 transition-transform",
                    isActive
                      ? "text-white group-hover:scale-110"
                      : "text-gray-400 group-hover:text-[#F75A27]"
                  )}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-700 pt-6">
          <div className="bg-white/10 p-4 rounded-lg mb-4 hover:bg-white/15 transition-colors duration-200 border border-white/5">
            {/* <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
              Account
            </p> */}
            <p className="text-sm font-semibold text-white truncate">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {session?.user?.email}
            </p>
          </div>
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = "/auth/login";
            }}
            className="w-full px-4 py-2.5 text-sm font-medium text-[#101828] bg-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
