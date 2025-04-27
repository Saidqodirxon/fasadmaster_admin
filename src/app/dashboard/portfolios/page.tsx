"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getPortfolios,
  deletePortfolio,
  type PortfolioData,
} from "@/src/lib/api/portfolios";
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

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(
    null
  );
  const router = useRouter();
  const { toast } = useToast();

  const fetchPortfolios = async () => {
    try {
      const data = await getPortfolios();
      setPortfolios(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось получить список портфолио",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [toast]);

  const handleDelete = async () => {
    if (!portfolioToDelete) return;

    try {
      await deletePortfolio(portfolioToDelete);
      toast({
        title: "Успешно",
        description: "Портфолио успешно удалено",
      });
      fetchPortfolios();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось удалить портфолио",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPortfolioToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setPortfolioToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Список портфолио</h2>
        <Button onClick={() => router.push("/dashboard/portfolios/create")}>
          <Plus className="mr-2 h-4 w-4" /> Добавить портфолио
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : portfolios.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Портфолио не найдено. Создайте ваше первое портфолио.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Изображения</TableHead>

              <TableHead className="text-right">Показать</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolios.map((portfolio) => (
              <TableRow key={portfolio._id}>
                <TableCell>
                  <div className="flex space-x-2">
                    {Array.isArray(portfolio.image) &&
                      portfolio.image
                        .slice(0, 3)
                        .map((img, index) => (
                          <Image
                            key={index}
                            src={img.url || "/placeholder.svg"}
                            alt={`${portfolio._id} ${index + 1}`}
                            className="w-12 h-12 object-cover rounded"
                            width={100}
                            height={100}
                          />
                        ))}

                    {Array.isArray(portfolio.image) &&
                      portfolio.image.length > 3 && (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-sm">
                          +{portfolio.image.length - 3}
                        </div>
                      )}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  {portfolio.is_visible ? (
                    <span className="text-green-500">Да</span>
                  ) : (
                    <span className="text-red-500">Нет</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      router.push(`/dashboard/portfolios/edit/${portfolio._id}`)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(portfolio._id!)}
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
              Это действие невозможно отменить. Оно приведёт к окончательному
              удалению портфолио.
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
