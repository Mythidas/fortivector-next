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
import { FolderCog, HousePlus, MoreHorizontal } from "lucide-react";
import RouteButton from "@/lib/components/ux/route-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteSystemsView } from "@/lib/schema/views";
import { Sites } from "@/lib/schema/database/sites";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/lib/components/ui/dropdown-menu";
import { deleteSiteAction, deleteSiteSystemLinkAction } from "@/lib/actions/sites";
import DeleteForm from "@/lib/components/forms/delete-form";
import { Button } from "@/lib/components/ui/button";
import DropDownItem from "@/lib/components/ux/drop-down-item";

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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systems.filter(filterSystems).map((system) => (
                <TableRow key={system.system_id}>
                  <TableCell>{system.system_name}</TableCell>
                  <TableCell>{system.system_description}</TableCell>
                  <TableCell className="text-right">
                    <DeleteForm id={system.link_id} url={`/clients/site/${site.id}?tab=systems`} action={deleteSiteSystemLinkAction}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropDownItem route={`/clients/system/${system.link_id}`} module="sites" level="read">
                            View
                          </DropDownItem>
                          <DropDownItem
                            type="submit"
                            variant="destructive"
                            module="sites"
                            level="full"
                            form={system.link_id}
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
    </>
  );
}