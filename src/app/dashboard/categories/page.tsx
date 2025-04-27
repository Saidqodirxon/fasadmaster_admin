"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getCategories,
  deleteCategories,
  type CategoriesData,
} from "@/src/lib/api/categories";
import { useToast } from "@/src/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import Image from "next/image";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoriesToDelete, setcategoriesToDelete] = useState<string | null>(
    null
  );
  const router = useRouter();
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const data = await getCategories("");
      setCategories(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось получить категорияы",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [toast]);

  const handleDelete = async () => {
    if (!categoriesToDelete) return;

    try {
      await deleteCategories(categoriesToDelete);
      toast({
        title: "Успешно",
        description: "Баннер успешно удален",
      });
      fetchCategories();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось удалить категория",
      });
    } finally {
      setDeleteDialogOpen(false);
      setcategoriesToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setcategoriesToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Список категорий</h2>
        <Button onClick={() => router.push("/dashboard/categories/create")}>
          <Plus className="mr-2 h-4 w-4" /> Добавить категория
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : !Array.isArray(categories) || categories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Баннеры не найдены. Создайте первый категория.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название (UZ)</TableHead>
              <TableHead>Название (RU)</TableHead>
              <TableHead>Название (EN)</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((categories: any) => (
              <TableRow key={categories._id}>
                <TableCell>{categories.name_uz}</TableCell>
                <TableCell>{categories.name_ru}</TableCell>
                <TableCell>{categories.name_en}</TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(
                        `/dashboard/categories/edit/${categories._id}`
                      )
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(categories._id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие необратимо. Баннер будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
