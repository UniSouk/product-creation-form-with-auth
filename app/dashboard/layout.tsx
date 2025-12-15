"use client";

import { usePathname } from "next/navigation";
import {
  LogOut,
  Plus,
  LayoutDashboard,
  ChevronDown,
  Menu,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios";
import companyLogo from "@/assets/images/brand_logo.svg";
import Image from "next/image";
import { successToast } from "@/ui/Toast";

interface UsersData {
  email: string;
  name: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usersData, setUsersData] = useState<UsersData>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mobileSidebarRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Create Product", icon: Plus, path: "/dashboard/product-create" },
    { label: "Feedback", icon: MessageSquare, path: "/dashboard/incomplete-form-feedback" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/users/me");
        setUsersData(response.data.data);
      } catch (error: any) {
        console.error(
          "Error fetching user:",
          error?.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Brand colors from design system
  const colors = {
    brandOrange: "#F57349",
    brandOrangeDark: "#F75A27",
    brandOrangeDarker: "#CA491E",
    grayLight: "#F9FAFB",
    grayLighter: "#FCFCFD",
    grayBorder: "#EAECF0",
    grayText: "#667085",
    grayTextDark: "#344054",
    grayDark: "#182230",
    white: "#FFFFFF",
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false); // close sidebar
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileSidebarRef.current &&
        !mobileSidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: colors.grayLight }}
    >
      {/* Top Navbar - Premium Design */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: colors.white,
          borderColor: colors.grayBorder,
          boxShadow:
            "0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)",
        }}
      >
        <div className="px-2 md:px-8 py-4 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg transition-all duration-200"
            style={{ color: colors.grayTextDark }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = colors.grayLight)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {!sidebarOpen && <Menu className="w-6 h-6" />}
          </button>

          {/* Logo & Brand - Premium */}
          <div className="flex items-center gap-3 flex-1 md:flex-none">
            <div>
              <Image
                src={companyLogo}
                width={20}
                height={20}
                alt="wix-icon"
                className="w-full"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm"
                  style={{
                    color: isActive ? colors.white : colors.grayTextDark,
                    backgroundColor: isActive
                      ? colors.brandOrange
                      : "transparent",
                    ...(isActive && {
                      boxShadow:
                        "0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)",
                    }),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.grayLight;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div ref={sidebarRef} className="flex items-center gap-4 relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group"
              style={{ color: colors.grayTextDark }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.grayLight)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div className="text-right hidden sm:block">
                <p
                  className="text-sm font-semibold"
                  style={{ color: colors.grayDark }}
                >
                  {usersData?.name}
                </p>
                <p className="text-xs" style={{ color: colors.grayText }}>
                  {usersData?.email}
                </p>
              </div>
              <div
                className="w-10 h-10 hidden rounded-full md:flex items-center justify-center font-semibold text-white text-sm transition-all duration-200 group-hover:shadow-lg"
                style={{
                  backgroundColor: colors.brandOrange,
                  boxShadow:
                    "0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)",
                }}
              >
                {usersData?.name?.charAt(0) || "U"}
              </div>
              <ChevronDown
                className="w-4 h-4 hidden md:block transition-transform duration-200"
                style={{
                  color: colors.grayText,
                  transform: userMenuOpen ? "rotate(180deg)" : "rotate(0)",
                }}
              />
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div
                className=" absolute right-0 top-full mt-3 w-64 rounded-xl py-3 z-50 border"
                style={{
                  backgroundColor: colors.white,
                  borderColor: colors.grayBorder,
                  boxShadow:
                    "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
                }}
              >

                {/* Mobile Navigation in Dropdown */}
                <div
                  className="md:hidden px-2 py-2 border-b"
                  style={{ borderColor: colors.grayBorder }}
                >
                  {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          router.push(item.path);
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium"
                        style={{
                          color: isActive ? colors.white : colors.grayTextDark,
                          backgroundColor: isActive
                            ? colors.brandOrange
                            : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor =
                              colors.grayLight;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }
                        }}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={() => {
                    document.cookie =
                      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie =
                      "storeId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie =
                      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    window.location.href = "/auth/login";
                  }}
                  className="w-full flex items-center gap-3 px-4 py-0.5 text-sm font-medium transition-all duration-200 mt-1"
                  style={{ color: colors.grayTextDark }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.cursor = "pointer")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden transition-opacity duration-200"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Smooth Animation */}
      <aside
        ref={mobileSidebarRef}
        className={clsx(
          "fixed left-0 top-24 h-[calc(100vh-8rem)] w-72 transform transition-transform duration-300 z-50 border-r rounded-tr-lg rounded-br-lg bg-gray-100",
          "md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          // backgroundColor: colors.white,
          borderColor: colors.grayBorder,
          boxShadow:
            "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
        }}
      >
        <div className="p-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => {
                  router.push(item.path);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium"
                style={{
                  color: isActive ? colors.white : colors.grayTextDark,
                  backgroundColor: isActive
                    ? colors.brandOrange
                    : "transparent",
                  ...(isActive && {
                    boxShadow:
                      "0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)",
                  }),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = colors.grayLight;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              document.cookie =
                "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie =
                "storeId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie =
                "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/auth/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 mt-1"
            style={{ color: colors.grayTextDark }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#FEE4E2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content - Clean & Spacious */}
      <main className="flex-1 overflow-auto">
        <div className="px-4 md:px-8 md:py-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
