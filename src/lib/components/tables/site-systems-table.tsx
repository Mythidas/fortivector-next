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
import { FolderCog, HousePlus } from "lucide-react";
import RouteButton from "@/lib/components/ux/route-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sites } from "@/lib/schema/database/clients";
import { SiteSystemsView } from "@/lib/schema/views";

type Props = {
  site: Sites;
  systems: SiteSystemsView[];
}

export default function SiteSystemsTable({ site, systems }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filterSystems(system: SiteSystemsView) {
    const lowerSearch = search.toLowerCase();
    const lowerName = system.system_name.toLowerCase();
    const lowerDescription = system.system_description.toLowerCase();
    return lowerName.includes(lowerSearch) || lowerDescription.includes(lowerSearch);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            placeholder="Search systems..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <RouteButton route={`/clients/site/${site.id}/link-system`} module="sites" level="edit">
          <FolderCog className="h-4 w-4 mr-2" />
          Link System
        </RouteButton>
      </div>

      <Card className="py-2">
        <CardContent className="p-0">
          <Table>
            <TableCaption>Total Systems: {systems.length}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systems.filter(filterSystems).map((system) => (
                <TableRow key={system.system_id} className="hover:cursor-pointer" onClick={() => router.push(`/clients/site/${site.id}/${system.link_id}`)}>
                  <TableCell>{system.system_name}</TableCell>
                  <TableCell>{system.system_description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}