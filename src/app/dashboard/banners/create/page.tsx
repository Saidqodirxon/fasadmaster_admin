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
import { FileUpload } from "@/src/components/file-upload";
import { createBanner, type BannerData } from "@/src/lib/api/banners";
import type { ImageData } from "@/src/lib/api/banners";
import { useToast } from "@/src/hooks/use-toast";

export default function CreateBannerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BannerData>({
    name_uz: "",
    name_ru: "",
    name_en: "",
    description_uz: "",
    description_ru: "",
    description_en: "",
    image: {} as ImageData,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (value: ImageData | ImageData[]) => {
    const image = Array.isArray(value) ? value[0] : value;
    console.log("Selected image:", image);

    if (image) {
      setFormData((prev) => ({ ...prev, image }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image || !formData.image.url) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, загрузите изображение",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("Отправка данных баннера:", formData);
      await createBanner(formData);
      toast({
        title: "Успешно",
        description: "Баннер успешно создан",
      });
      router.push("/dashboard/banners");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось создать баннер",
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
        onClick={() => router.push("/dashboard/banners")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад к баннерам
      </Button>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name_uz">Название (UZ)</Label>
                <Input
                  id="name_uz"
                  name="name_uz"
                  value={formData.name_uz}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_ru">Название (RU)</Label>
                <Input
                  id="name_ru"
                  name="name_ru"
                  value={formData.name_ru}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_en">Название (EN)</Label>
                <Input
                  id="name_en"
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="description_uz">Описание (UZ)</Label>
                <Textarea
                  id="description_uz"
                  name="description_uz"
                  value={formData.description_uz}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_ru">Описание (RU)</Label>
                <Textarea
                  id="description_ru"
                  name="description_ru"
                  value={formData.description_ru}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_en">Описание (EN)</Label>
                <Textarea
                  id="description_en"
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Изображение баннера</Label>
              <FileUpload
                multiple={false}
                value={formData.image || []}
                onChange={handleImageChange}
              />
              {formData.image && formData.image?.url && (
                <p className="text-xs text-green-600 mt-1">
                  Изображение успешно загружено: {formData.image.id}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Создание..." : "Создать баннер"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
