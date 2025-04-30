"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent } from "@/src/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { FileUpload } from "@/src/components/file-upload";
import { createService, type ServiceData } from "@/src/lib/api/services";
import type { ImageData } from "@/src/lib/api/banners";
import { useToast } from "@/src/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import { getCategories, type CategoriesData } from "@/src/lib/api/categories";

export default function CreateServicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoriesData[]>([]);

  const [formData, setFormData] = useState<ServiceData>({
    name_uz: "",
    name_ru: "",
    name_en: "",
    description_uz: "",
    description_ru: "",
    description_en: "",
    is_visible: false,
    view: "1",
    categoryId: "",
    price: "",
    image: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories("/categories");
        console.log("Fetched categories:", response); // Debug uchun
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error); // Debug uchun
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить категории",
        });
      }
    };
    fetchCategories();
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (value: ImageData | ImageData[] | null) => {
    const images = Array.isArray(value) ? value : value ? [value] : [];
    setFormData((prev) => ({ ...prev, image: images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image || formData.image.length === 0) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, загрузите хотя бы одно изображение",
      });
      return;
    }

    if (!formData.categoryId) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, выберите категорию",
      });
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting formData:", formData); // Debug uchun
      await createService(formData);
      toast({
        title: "Успешно",
        description: "Услуга успешно создана",
      });
      router.push("/dashboard/services");
    } catch (error: any) {
      console.error("Error creating service:", error); // Debug uchun
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось создать услугу",
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
        onClick={() => router.push("/dashboard/services")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад к услугам
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Цена</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Категория</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => {
                    console.log("Selected category:", value); // Debug uchun
                    setFormData((prev) => ({ ...prev, categoryId: value }));
                  }}
                >
                  <SelectTrigger className="flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white text-sm">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border rounded-md shadow-md max-h-60 overflow-y-auto">
                    {categories.map((category: any) => (
                      <SelectItem
                        key={category._id}
                        value={category._id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {category.name_ru}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="view">Вид</Label>
                <Select
                  value={formData.view}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      view: value as "1" | "2",
                    }));
                  }}
                >
                  <SelectTrigger className="flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white text-sm">
                    <SelectValue placeholder="Выберите вид" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border rounded-md shadow-md">
                    <SelectItem
                      value="1"
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Вид 1
                    </SelectItem>
                    <SelectItem
                      value="2"
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Вид 2
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_visible">показать на главной странице</Label>
              <Input
                type="checkbox"
                id="is_visible"
                name="is_visible"
                checked={formData.is_visible}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_visible: e.target.checked,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Изображения услуги</Label>
              <FileUpload
                multiple={true}
                value={formData.image}
                onChange={handleImageChange}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Создание..." : "Создать услугу"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
