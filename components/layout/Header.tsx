'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Bell } from "lucide-react"
import { jwtDecode } from "jwt-decode";

interface HeaderProps {
  title?: string
}

interface DecodedToken {
  id: number;
  email: string;
  name?: string;
  position?: string;
}

function HeaderComponent({ title = "대시보드" }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [adminName, setAdminName] = useState<string>("관리자");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const shortName = decoded.name ? decoded.name.slice(0, 1) : "관";
        setAdminName(decoded.name || decoded.email || "관리자");
      } catch (e) {
        console.error("토큰 디코딩 실패", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/auth");
  };

  if (!mounted) return null;

  return (
    <header className="bg-surface-light dark:bg-surface-dark text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center">
      <div className="relative flex items-center justify-between w-full">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h2> 

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700">
                <Bell className="h-5 w-5 text-gray-900 dark:text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-white dark:bg-gray-600 text-white w-64 max-h-80 overflow-auto">
              <p className="p-4 text-sm text-gray-900 dark:text-white">알림이 없습니다.</p>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium bg-white dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{adminName.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium px-2 py-1 rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white">
                  {adminName}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-white text-gray-900 dark:bg-gray-700 dark:text-white">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                프로필
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;