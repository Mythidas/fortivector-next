'use client'

import { deleteSiteAction } from "@/lib/actions/sites";
import DeleteForm from "@/lib/components/forms/delete-form";
import { Button } from "@/lib/components/ui/button";
import { Card, CardContent } from "@/lib/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/lib/components/ui/dropdown-menu";
import { Input } from "@/lib/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/lib/components/ui/table";
import DropDownItem from "@/lib/components/ux/drop-down-item";
import RouteButton from "@/lib/components/ux/route-button";
import { Clients } from "@/lib/schema/database/clients";
import { Sites } from "@/lib/schema/database/sites";
import { HousePlus, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  sites: Sites[];
  client: Clients;
}

export default function SitesTable(props: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filterSites(site: Sites) {
    const lowerSearch = search.toLowerCase();
    const lowerName = site.name.toLowerCase();
    return lowerName.includes(lowerSearch);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            placeholder="Search sites..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <RouteButton route={`/clients/${props.client.id}/create-site`} module="sites" level="edit">
          <HousePlus className="h-4 w-4 mr-2" />
          Add Site
        </RouteButton>
      </div>

      <Card className="py-2">
        <CardContent className="p-0">
          <Table>
            <TableCaption>Total Sites: {props.sites.length}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.sites.filter(filterSites).map((site) => (
                <TableRow key={site.id}>
                  <TableCell>{site.name}</TableCell>
                  <TableCell className="text-right">
                    <DeleteForm id={site.id} url={`/clients/${props.client.id}?tab=sites`} action={deleteSiteAction}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropDownItem route={`/clients/site/${site.id}`} module="sites" level="read">
                            View
                          </DropDownItem>
                          <DropDownItem
                            type="submit"
                            variant="destructive"
                            module="sites"
                            level="full"
                            form={site.id}
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