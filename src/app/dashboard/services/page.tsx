"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus, Pencil, Trash2, FilterX } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getServices,
  deleteService,
  type ServiceData,
} from "@/src/lib/api/services";
import { getCategories, type CategoriesData } from "@/src/lib/api/categories";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";
import Image from "next/image";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [categories, setCategories] = useState<CategoriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    is_visible?: boolean;
    view?: "1" | "2";
    categoryId?: string;
    searchQuery?: string; // Added search query filter
  }>({});
  const router = useRouter();
  const { toast } = useToast();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getCategories("/categories");
      console.log("Fetched categories:", data);
      setCategories(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Fetch categories error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось загрузить категории",
      });
    }
  };

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getServices("services", {
        ...filters,
        q: filters.searchQuery,
      });
      console.log("Fetched services response:", response);
      const serviceData = Array.isArray(response.data) ? response.data : [];
      setServices(serviceData);
      if (serviceData.length === 0) {
        toast({
          title: "Информация",
          description: "Услуги не найдены для текущих фильтров",
        });
      }
    } catch (error: any) {
      console.error("Fetch services error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось загрузить услуги",
      });
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Applying filters:", filters);
    fetchCategories();
    fetchServices();
  }, [filters]);

  // Handle deletion
  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      await deleteService(serviceToDelete);

      toast({
        title: "Успешно",
        description: `Услуга успешно удалена`,
      });
      fetchServices();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message || "Не удалось удалить услугу",
      });
    } finally {
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };
  const confirmDelete = (id: string) => {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle filter changes
  const handleFilterChange = (
    key: "is_visible" | "view" | "categoryId" | "searchQuery",
    value: string
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (value === "all") {
        delete newFilters[key];
      } else {
        if (key === "is_visible") {
          newFilters[key] = value === "true" ? true : false;
        } else {
          newFilters[key] = value as "1" | "2" | undefined;
        }
      }
      console.log("Updated filters:", newFilters);
      return newFilters;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    console.log("Cleared filters");
  };

  // Find category name by ID
  const getCategoryName = (categoryId: string) =>
    categories.find((cat) => cat._id === categoryId)?.name_uz || "N/A";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Список услуг</h2>
        <Button
          variant="default"
          className="bg-primary hover:bg-primary/90"
          onClick={() => router.push("/dashboard/services/create")}
        >
          <Plus className="mr-2 h-4 w-4" /> Добавить услугу
        </Button>
      </div>

      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full max-w-xs p-2 border rounded-md"
          placeholder="Поиск по названию (RU)"
          onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 max-w-xs">
          <Select
            value={filters.categoryId || "all"}
            onValueChange={(value) => handleFilterChange("categoryId", value)}
          >
            <SelectTrigger className="flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white text-sm">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent className="bg-white border rounded-md shadow-md max-h-60 overflow-y-auto">
              <SelectItem
                value="all"
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Все категории
              </SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category._id}
                  value={category._id!}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {category.name_uz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 max-w-xs">
          <Select
            value={filters.is_visible?.toString() || "all"}
            onValueChange={(value) => handleFilterChange("is_visible", value)}
          >
            <SelectTrigger className="flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white text-sm">
              <SelectValue placeholder="Видимость" />
            </SelectTrigger>
            <SelectContent className="bg-white border rounded-md shadow-md max-h-60 overflow-y-auto">
              <SelectItem
                value="all"
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Все
              </SelectItem>
              <SelectItem
                value="true"
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Видимые
              </SelectItem>
              <SelectItem
                value="false"
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Скрытые
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 max-w-xs">
          <Select
            value={filters.view || "all"}
            onValueChange={(value) => handleFilterChange("view", value)}
          >
            <SelectTrigger className="flex items-center justify-between w-full h-10 px-3 border rounded-md bg-white text-sm">
              <SelectValue placeholder="Тип вида" />
            </SelectTrigger>
            <SelectContent className="bg-white border rounded-md shadow-md max-h-60 overflow-y-auto">
              <SelectItem
                value="all"
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Все виды
              </SelectItem>
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
        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={
            !filters.categoryId &&
            filters.is_visible === undefined &&
            !filters.view
          }
        >
          <FilterX className="mr-2 h-4 w-4" /> Очистить
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Услуги не найдены. Попробуйте изменить фильтры или создать новую
            услугу.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название (RU)</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell>{service.name_ru}</TableCell>
                <TableCell>{getCategoryName(service.categoryId)}</TableCell>
                <TableCell>
                  {service.view === "1" ? "Вид 1" : "Вид 2"}
                </TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      router.push(`/dashboard/services/edit/${service._id}`)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => service._id && confirmDelete(service._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердить удаление</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить услугу ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
function setPortfolioToDelete(id: string) {
  throw new Error("Function not implemented.");
}
