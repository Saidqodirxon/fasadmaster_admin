"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent } from "@/src/components/ui/card";
import { formatDate } from "@/src/lib/utils";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
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

  useEffect(() => {
    fetchContacts();
  }, [toast]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Запросы на связь</h2>
        <p className="text-muted-foreground">
          Просмотрите все запросы на связь от клиентов
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Запросы на связь не найдены.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell className="font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      {contact.createdAt ? formatDate(contact.createdAt) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
