"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { MessageSquare } from "lucide-react";
import { getContacts, type ContactData } from "@/src/lib/api/contacts";
import { useToast } from "@/src/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { formatDate } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function Dashboard() {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [visibleCount, setVisibleCount] = useState(5); // Start by showing 5 contacts
  const [loading, setLoading] = useState(true);
  const [visiblePhones, setVisiblePhones] = useState<Record<string, boolean>>(
    {}
  );
  const { toast } = useToast();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();

        // Sort contacts by creation date in descending order (newest first)
        const sortedContacts = Array.isArray(data)
          ? data.sort(
              (a, b) =>
                new Date(b.createdAt ?? 0).getTime() -
                new Date(a.createdAt ?? 0).getTime()
            )
          : [];

        setContacts(sortedContacts);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: error.message || "Не удалось получить список контактов",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [toast]);

  const showMoreContacts = () => {
    setVisibleCount((prevCount) => prevCount + 5); // Increment the visible count by 5
  };

  const togglePhoneVisibility = (id: string) => {
    setVisiblePhones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Последние запросы на связь
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  Запросов на связь не найдено.
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Имя</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Дата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.slice(0, visibleCount).map((contact, index) => (
                      <TableRow key={contact._id || index}>
                        <TableCell className="font-medium">
                          {contact.name}
                        </TableCell>
                        <TableCell>
                          {visiblePhones[contact._id ?? ""] ? (
                            contact.phone
                          ) : (
                            <span className="text-muted-foreground">
                              Скрыто
                            </span>
                          )}
                          <button
                            onClick={() =>
                              togglePhoneVisibility(contact._id || "")
                            }
                            className="ml-2 text-gray-600 hover:text-primary transition-colors"
                          >
                            {visiblePhones[contact._id ?? ""] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell>
                          {contact.createdAt
                            ? formatDate(contact.createdAt)
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {visibleCount < contacts.length && (
                  <div className="flex justify-center mt-4">
                    <Button onClick={showMoreContacts}>Показать ещё</Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
