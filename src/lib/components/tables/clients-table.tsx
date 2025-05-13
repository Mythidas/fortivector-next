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
import { Building2, MoreHorizontal } from "lucide-react";
import RouteButton from "@/lib/components/ux/route-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clients } from "@/lib/schema/database/clients";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/lib/components/ui/dropdown-menu";
import DeleteForm from "@/lib/components/forms/delete-form";
import { Button } from "@/lib/components/ui/button";
import DropDownItem from "@/lib/components/ux/drop-down-item";
import { deleteClientAciton } from "@/lib/actions/clients";
import { Sites } from "@/lib/schema/database/sites";

type Props = {
  clients: Clients[];
  sites: Sites[];
}

export default function ClientsTable({ clients, sites }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filterClients(client: Clients) {
    const lowerSearch = search.toLowerCase();
    const lowerName = client.name.toLowerCase();
    return lowerName.includes(lowerSearch);
  }

  function filterSites(site: Sites, client: Clients) {
    return site.client_id === client.id;
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
                <TableHead>Sites</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.filter(filterClients).map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{sites.filter((site) => filterSites(site, client)).length}</TableCell>
                  <TableCell className="text-right">
                    <DeleteForm id={client.id} action={deleteClientAciton}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropDownItem route={`/clients/${client.id}`} module="clients" level="read">
                            View
                          </DropDownItem>
                          <DropDownItem
                            type="submit"
                            variant="destructive"
                            module="roles"
                            level="full"
                            form={client.id}
                            disabled={sites.filter((site) => filterSites(site, client)).length > 0}
                          >
                            Delete
                          </DropDownItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </DeleteForm>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}