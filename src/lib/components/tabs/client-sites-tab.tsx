'use client';

import { TabsContent } from "@/lib/components/ui/tabs";
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
import { HousePlus } from "lucide-react";
import RouteButton from "@/lib/components/ui/protected/route-button";
import { Clients, Sites } from "@/lib/schema/database";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  client: Clients;
  sites: Sites[];
}

export default function ClientSitesTab({ client, sites }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filterSites(site: Sites) {
    const lowerSearch = search.toLowerCase();
    const lowerName = site.name.toLowerCase();
    return lowerName.includes(lowerSearch);
  }

  return (
    <TabsContent value="sites">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            placeholder="Search sites..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <RouteButton route={`/clients/${client.id}/create-site`} module="sites" level="edit">
          <HousePlus className="h-4 w-4 mr-2" />
          Add Site
        </RouteButton>
      </div>

      <Card className="py-2">
        <CardContent className="p-0">
          <Table>
            <TableCaption>Total Sites: {sites.length}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.filter(filterSites).map((site) => (
                <TableRow key={site.id} className="hover:cursor-pointer" onClick={() => router.push(`/clients/site/${site.id}`)}>
                  <TableCell>{site.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
}