"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAbout, deleteAbout, type AboutData } from "@/src/lib/api/about";
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

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [aboutToDelete, setaboutToDelete] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchAbout = async () => {
    try {
      const data = await getAbout("");
      setAbout(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось получить o насы",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, [toast]);

  const handleDelete = async () => {
    if (!aboutToDelete) return;

    try {
      await deleteAbout(aboutToDelete);
      toast({
        title: "Успешно",
        description: "Баннер успешно удален",
      });
      fetchAbout();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось удалить o нас",
      });
    } finally {
      setDeleteDialogOpen(false);
      setaboutToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setaboutToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">О нас список</h2>
        <Button onClick={() => router.push("/dashboard/about/create")}>
          <Plus className="mr-2 h-4 w-4" /> Добавить o нас
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : !Array.isArray(about) || about.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Баннеры не найдены. Создайте первый o нас.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>О нас (UZ)</TableHead>
              <TableHead>О нас (RU)</TableHead>
              <TableHead>О нас (EN)</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {about.map((about: any) => (
              <TableRow key={about._id}>
                <TableCell>{about.about_uz}</TableCell>
                <TableCell>{about.about_ru}</TableCell>
                <TableCell>{about.about_en}</TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(`/dashboard/about/edit/${about._id}`)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(about._id!)}
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
