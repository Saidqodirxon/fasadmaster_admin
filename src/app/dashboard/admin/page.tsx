"use client";

import React, { useState, useEffect } from "react";
import { getMe, updateMe } from "@/src/lib/api/auth";
import { Button } from "@/src/components/ui/button"; // Предположим, что у вас есть компонент Button
import { useToast } from "@/src/hooks/use-toast";

const UpdatePage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Поле для подтверждения пароля
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Состояние загрузки данных
  const [showPassword, setShowPassword] = useState(false); // Флаг для отображения пароля
  const { toast } = useToast();

  // Получение данных пользователя
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getMe();
        setLogin(userData.login); // Добавляем полученный с сервера логин в форму
        setPassword(""); // Оставляем поле пароля пустым, так как его хотим обновить
        setConfirmPassword(""); // Оставляем поле подтверждения пароля пустым
        setLoading(false);
      } catch (err: any) {
        setError("Не удалось получить данные пользователя");
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Вызывается только один раз

  const handleUpdate = async () => {
    try {
      // Проверка паролей
      if (password !== confirmPassword) {
        setError("Пароли не совпадают.");
        return;
      }
      const userData = await getMe();
      const updatedData = await updateMe({ login, password });
      setSuccess("Данные пользователя успешно обновлены!");
      toast({
        title: "Успешно",
        description: "Баннер успешно создан",
      });

      setLogin(userData.login); // Добавляем полученный с сервера логин в форму
      setPassword(""); // Оставляем поле пароля пустым, так как его хотим обновить
      setConfirmPassword("");
      console.log(updatedData); // Лог для проверки
    } catch (err: any) {
      setError(err.message || "Что-то пошло не так");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Показать/скрыть пароль
  };

  return (
    <div className="w-[50vw]">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Обновите вашу информацию
      </h1>
      {loading && <p className="text-center text-gray-500">Загрузка...</p>}{" "}
      {/* Если данные загружаются, показать текст "Загрузка" */}
      {error && <p className="text-center text-red-600">{error}</p>}{" "}
      {/* Если есть ошибка */}
      {success && <p className="text-center text-green-600">{success}</p>}{" "}
      {/* Если обновление успешно */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Логин:
        </label>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Пароль:
        </label>
        <input
          type={showPassword ? "text" : "password"} // Показать/скрыть пароль
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
        />
        <button onClick={togglePasswordVisibility} className="mt-2 text-sm ">
          {showPassword ? "Скрыть пароль" : "Показать пароль"}
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Подтвердите пароль:
        </label>
        <input
          type={showPassword ? "text" : "password"} // Показать/скрыть для подтверждения пароля
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
        />
      </div>
      <div className="flex justify-center">
        <Button onClick={handleUpdate} className="w-full">
          Обновить
        </Button>
      </div>
    </div>
  );
};

export default UpdatePage;
