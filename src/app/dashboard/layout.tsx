"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { Button } from "@/src/components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  ImageIcon,
  Briefcase,
  Settings,
  User,
} from "lucide-react";
import { getMe, type AdminData } from "@/src/lib/api/auth";
import { Toaster } from "@/src/components/ui/toaster";
import { useToast } from "@/src/hooks/use-toast";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AdminData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const verifyAuth = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
        setLoading(false);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          toast({
            variant: "destructive",
            title: "Ошибка аутентификации",
            description: "Сессия истекла. Пожалуйста, войдите снова.",
          });
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          toast({
            variant: "destructive",
            title: "Ошибка сервера",
            description:
              "Не удалось подключиться к серверу. Пожалуйста, попробуйте позже.",
          });
          setLoading(false);
        }
      }
    };

    verifyAuth();
  }, [router, toast]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <a href="/dashboard">
              <Image
                src="https://admin.artjalyuzi.uz/logo.png"
                alt="Логотип"
                className="object-cover rounded"
                width={200}
                height={100}
              />
            </a>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                  <a href="/dashboard">
                    <LayoutDashboard className="mr-2" />
                    <span>Панель управления</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes("/dashboard/banners")}
                >
                  <a href="/dashboard/banners">
                    <ImageIcon className="mr-2" />
                    <span>Баннеры</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes("/dashboard/portfolios")}
                >
                  <a href="/dashboard/portfolios">
                    <Briefcase className="mr-2" />
                    <span>Портфолио</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes("/dashboard/services")}
                >
                  <a href="/dashboard/services">
                    <Settings className="mr-2" />
                    <span>Услуги</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes("/dashboard/categories")}
                >
                  <a href="/dashboard/categories">
                    <ImageIcon className="mr-2" />
                    <span>Категории</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes("/dashboard/about")}
                >
                  <a href="/dashboard/about">
                    <ImageIcon className="mr-2" />
                    <span>О нас</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="mb-4 flex items-center gap-3 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <a className="flex flex-col" href="/dashboard/admin">
                <span className="text-sm font-medium">
                  {user?.login || "Админ"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Администратор
                </span>
              </a>
            </div>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarTrigger />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {pathname === "/dashboard" && "Панель управления"}
              {pathname.includes("/dashboard/banners") &&
                "Управление баннерами"}
              {pathname.includes("/dashboard/portfolios") &&
                "Управление портфолио"}
              {pathname.includes("/dashboard/services") &&
                "Управление услугами"}
            </h1>
          </div>
          {children}
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
