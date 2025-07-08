import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Logout from "../logout/logout";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar({ children }) {
  const { data } = useSession();

  const menu = [
    { title: "Dashboard", href: "dashboard" },
    { title: "Projects", href: "projects" },
    { title: "Maintenance", href: "maintenance" },
    { title: "Request", href: "requests" },
  ];
  const adminMenu = [...menu, { title: "Admin", href: "adminPanel" }];

  const isAdmin = data?.user?.role === "admin";
  const navItems = isAdmin ? adminMenu : menu;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between mx-auto">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-bold text-xl flex items-center gap-2 text-indigo-600"
            >
              <Image
                src={"/images/logo.svg"}
                alt="Webmints Logo"
                width={100}
                height={100}
                className="h-10 w-auto"
              />
              Webmints
            </Link>
            <nav className="hidden md:flex gap-6">
              {navItems &&
                navItems?.map((item) => (
                  <Link
                    key={item?.title}
                    href={item?.href}
                    className="text-sm font-medium hover:text-indigo-600 transition-colors font-grotesk"
                  >
                    {item?.title}
                  </Link>
                ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Notifications
            </Button>
            <Logout />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-10 mx-auto">{children}</div>
      </main>
    </div>
  );
}
