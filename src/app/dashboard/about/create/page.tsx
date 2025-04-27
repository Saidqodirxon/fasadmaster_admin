"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent } from "@/src/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { createAbout, type AboutData } from "@/src/lib/api/about";
import { useToast } from "@/src/hooks/use-toast";

export default function CreateAboutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AboutData>({
    about_uz: "",
    about_ru: "",
    about_en: "",
    history_uz: "",
    history_ru: "",
    history_en: "",
    adventages_uz: "",
    adventages_ru: "",
    adventages_en: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      console.log("Отправка данных o наса:", formData);
      await createAbout(formData);
      toast({
        title: "Успешно",
        description: "Баннер успешно создан",
      });
      router.push("/dashboard/about");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось создать o нас",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/dashboard/about")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад к o насам
      </Button>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="about_uz">O нас (UZ)</Label>
                <Textarea
                  id="about_uz"
                  name="about_uz"
                  value={formData.about_uz}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_ru">O нас (RU)</Label>
                <Textarea
                  id="about_ru"
                  name="about_ru"
                  value={formData.about_ru}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_en">O нас (EN)</Label>
                <Textarea
                  id="about_en"
                  name="about_en"
                  value={formData.about_en}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="history_uz">История (UZ)</Label>
                <Textarea
                  id="history_uz"
                  name="history_uz"
                  value={formData.history_uz}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="history_ru">История (RU)</Label>
                <Textarea
                  id="history_ru"
                  name="history_ru"
                  value={formData.history_ru}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="history_en">История (EN)</Label>
                <Textarea
                  id="history_en"
                  name="history_en"
                  value={formData.history_en}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="adventages_uz">Преимущества (UZ)</Label>
                <Textarea
                  id="adventages_uz"
                  name="adventages_uz"
                  value={formData.adventages_uz}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adventages_ru">Преимущества (RU)</Label>
                <Textarea
                  id="adventages_ru"
                  name="adventages_ru"
                  value={formData.adventages_ru}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adventages_en">Преимущества (EN)</Label>
                <Textarea
                  id="adventages_en"
                  name="adventages_en"
                  value={formData.adventages_en}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Создание..." : "Создать o нас"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
