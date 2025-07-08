import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarPage from "@/components/upload/upload";
import {
  Accessibility,
  Bell,
  CreditCard,
  Settings,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const menuItems = [
  {
    name: "General",
    icon: Settings,
  },
  { name: "Account", icon: User },
  { name: "Plans & upgrades", icon: CreditCard },
  { name: "Privacy", icon: Shield },
  { name: "Notification", icon: Bell },
  { name: "Accessibility", icon: Accessibility },
];

export default function Layout({ children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-screen flex">
          <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
            {/* Menu Items */}

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      className={`w-full flex items-center justify-between py-3 rounded-lg text-left transition-colors cursor-pointer`}
                      href={"settings"}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6">{children}</div>
          <CalendarPage />
        </div>
      </CardContent>
    </Card>
  );
}
