"use client"

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes"; 
import Header from "@/components/layout/Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { resolvedTheme } = useTheme(); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const bgColor = resolvedTheme === "dark" ? "bg-content-dark" : "bg-content-light"; 

  return (
    <div className={`flex ${bgColor} min-h-screen`}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;