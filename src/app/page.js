"use client";
import React, { useState } from "react";
import {
  Users,
  Cpu,
  Home,
  UserCog,
  User,
  HelpCircle,
  BarChart2,
  Menu,
  CreditCard,
  ChevronRight,
} from "lucide-react";

import Registration from "@/components/Registration";
import UserGroup from "@/components/UserGroup";
import Device from "@/components/Device";
import Finance from "@/components/Finance";
import Clients from "@/components/Clients";

export default function CallengoPage() {
  const [activeMenu, setActiveMenu] = useState("menu");
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [userRole, setUserRole] = useState("admin");
  const [financeItems, setFinanceItems] = useState([]);

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderMainContent = () => {
    switch (activeMenu) {
      case "menu":
        return (
          <div className="text-gray-700 text-lg">Dashboard coming soon</div>
        );
      case "clients":
        return <Clients userRole={userRole} />;
      case "systems":
        return <div>Systems Page</div>;
      case "devices":
        return <Device />;
      case "registration":
        return <Registration />;
      case "user-management":
        return <div>User Management Page</div>;
      case "user-group":
        return <UserGroup />;
      case "help":
        return <div>Help Page</div>;
      case "report":
        return <div>Report Page</div>;
      case "finance":
        return (
          <Finance
            items={financeItems}
            setItems={setFinanceItems}
            userRole={userRole}
          />
        );
      default:
        return <div className="text-gray-700 text-lg">Page coming soon</div>;
    }
  };

  const menuItems = [
    { label: "Menu", icon: Menu, key: "menu" },
    { label: "Clients", icon: Users, key: "clients" },
    {
      label: "Systems",
      icon: Cpu,
      key: "systems",
      sub: ["System A", "System B"],
    },
    {
      label: "Devices",
      icon: Home,
      key: "devices",
      sub: ["Device A", "Device B"],
    },
    { label: "Registration", icon: UserCog, key: "registration" },
    {
      label: "User Management",
      icon: UserCog,
      key: "user-management",
      sub: ["Roles", "Permissions"],
    },
    { label: "User Group", icon: User, key: "user-group" },
    { label: "Help", icon: HelpCircle, key: "help" },
    { label: "Report", icon: BarChart2, key: "report" },
    {
      label: "Finance",
      icon: CreditCard,
      key: "finance",
      sub: ["Monthly Breakdown"],
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-800">
      <aside className="w-64 flex flex-col bg-gray-800 text-gray-200 shadow-lg p-4">
        <div className="p-4 text-2xl font-bold border-b border-gray-700 mb-4">
          Callengo
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {menuItems.map((item) => (
            <div key={item.key}>
              <button
                onClick={() => {
                  if (item.sub) toggleSubmenu(item.key);
                  else setActiveMenu(item.key);
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeMenu === item.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-200 hover:bg-blue-500 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.sub && (
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openSubmenus[item.key] ? "rotate-90" : ""
                    }`}
                  />
                )}
              </button>

              {/* Submenu items */}
              {item.sub && openSubmenus[item.key] && (
                <div className="ml-6 flex flex-col gap-1 mt-1">
                  {item.sub.map((subItem) => (
                    <button
                      key={subItem}
                      onClick={() => setActiveMenu(item.key)}
                      className="text-gray-300 hover:bg-blue-400 hover:text-white px-3 py-1 text-sm rounded-md text-left"
                    >
                      {subItem}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">{renderMainContent()}</main>
    </div>
  );
}
