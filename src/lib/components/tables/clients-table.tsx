'use client';

import { Input } from "@/lib/components/ui/input";
import {
  Card,
  CardContent,
} from "@/lib/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";
import { Building2 } from "lucide-react";
import RouteButton from "@/lib/components/ux/route-button";
import { Clients } from "@/lib/schema/database";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  clients: Clients[];
}

export default function ClientsTable({ clients }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filterClients(client: Clients) {
    const lowerSearch = search.toLowerCase();
    const lowerName = client.name.toLowerCase();
    return lowerName.includes(lowerSearch);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            placeholder="Search clients..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <RouteButton route="/clients/create" module="clients" level="edit">
          <Building2 className="h-4 w-4 mr-2" />
          Add Client
        </RouteButton>
      </div>

      <Card className="py-2">
        <CardContent className="p-0">
          <Table>
            <TableCaption>Total Clients: {clients.length}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.filter(filterClients).map((client) => (
                <TableRow key={client.id} className="hover:cursor-pointer" onClick={() => router.push(`/clients/${client.id}`)}>
                  <TableCell>{client.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}