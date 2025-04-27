"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { login } from "@/src/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Отправка данных для входа:", loginData);
      const data = await login(loginData);

      // Убедитесь, что токен получен перед его сохранением
      if (!data.token) {
        throw new Error("Сервер не вернул токен");
      }

      console.log("Вход выполнен успешно, токен получен:", data.token);

      // Сохраните токен в localStorage
      localStorage.setItem("token", data.token);

      // Проверьте, что токен был успешно сохранен
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        throw new Error("Не удалось сохранить токен авторизации");
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Ошибка входа:", err);
      setError(
        err.message || "Ошибка входа. Пожалуйста, проверьте свои данные."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Вход администратора</CardTitle>
          <CardDescription>
            Введите свои данные для доступа к админ-панели
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="login">Имя пользователя</Label>
              <Input
                id="login"
                name="login"
                value={loginData.login}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Вход..." : "Войти"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
