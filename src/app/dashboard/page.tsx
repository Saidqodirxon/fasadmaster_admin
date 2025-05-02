// app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { MessageSquare, Eye, EyeOff } from "lucide-react";
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

export default function Dashboard() {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [visiblePhones, setVisiblePhones] = useState<Record<string, boolean>>(
    {}
  );
  const { toast } = useToast();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
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

  const showMoreContacts = () => setVisibleCount((prev) => prev + 5);

  const togglePhoneVisibility = (id: string) => {
    setVisiblePhones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const maskPhone = (phone: string) => phone.replace(/.(?=.{4})/g, "*");

  return (
    <>
      <Head>
        <title>Admin Dashboard | Fasad Master</title>
        <meta name="description" content="Просмотр контактов клиентов" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <meta name="referrer" content="no-referrer" />
      </Head>

      <div className="space-y-6 mt-8">
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
                    {contacts.slice(0, visibleCount).map((contact) => (
                      <TableRow key={contact._id}>
                        <TableCell className="font-medium">
                          {contact.name}
                        </TableCell>
                        <TableCell>
                          {visiblePhones[contact._id ?? ""]
                            ? contact.phone
                            : maskPhone(contact.phone)}
                          <button
                            onClick={() => contact._id && togglePhoneVisibility(contact._id)}
                            className="ml-2 text-gray-600 hover:text-primary transition-colors"
                          >
                            {contact._id && visiblePhones[contact._id] ? (
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
    </>
  );
}
