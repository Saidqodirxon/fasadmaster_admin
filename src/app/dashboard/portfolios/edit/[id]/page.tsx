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
import {
  getPortfolio,
  updatePortfolio,
  type PortfolioData,
} from "@/src/lib/api/portfolios";
import type { ImageData } from "@/src/lib/api/banners";
import { useToast } from "@/src/hooks/use-toast";

export default function EditPortfolioPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<PortfolioData>({
    image: [],
    is_visible: false,
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolio(params.id);
        setFormData(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: error.message || "Не удалось загрузить портфолио",
        });
        router.push("/dashboard/portfolios");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPortfolio();
  }, [params.id, router, toast]);

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

    setLoading(true);
    try {
      await updatePortfolio(params.id, formData);
      toast({
        title: "Успешно",
        description: "Портфолио успешно обновлено",
      });
      router.push("/dashboard/portfolios");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось обновить портфолио",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/dashboard/portfolios")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Назад к портфолио
      </Button>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Изображения портфолио</Label>
              <FileUpload
                multiple={true}
                value={formData.image}
                onChange={handleImageChange}
              />
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

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Обновление..." : "Обновить портфолио"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
