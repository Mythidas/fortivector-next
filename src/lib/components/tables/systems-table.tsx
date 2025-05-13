'use client';

import { Input } from "@/lib/components/ui/input";
import {
  Card,
} from "@/lib/components/ui/card";
import { FolderCog, MoreHorizontal } from "lucide-react";
import RouteButton from "@/lib/components/ux/route-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/lib/components/ui/table";
import { Systems } from "@/lib/schema/database/systems";
import DeleteForm from "@/lib/components/forms/delete-form";
import { Button } from "@/lib/components/ui/button";
import DropDownItem from "@/lib/components/ux/drop-down-item";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/lib/components/ui/dropdown-menu";
import { deleteSystemAction } from "@/lib/actions/systems";

interface Props {
  systems: Systems[]
}

export default function SystemsTable({ systems }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filter(system: Systems) {
    const lowerSearch = search.toLowerCase();
    const lowerName = system.name.toLowerCase();
    const lowerDescription = system.description?.toLowerCase() || "";
    return lowerName.includes(lowerSearch) || lowerDescription.includes(lowerSearch);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            placeholder="Search systems..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <RouteButton route="/systems/create" module="systems" level="edit">
          <FolderCog className="h-4 w-4 mr-2" />
          Add System
        </RouteButton>
      </div>

      <Card className="py-2">
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
            {systems.filter(filter).map((system) => (
              <TableRow key={system.id}>
                <TableCell>{system.name}</TableCell>
                <TableCell>{system.description}</TableCell>
                <TableCell className="text-right">
                  <DeleteForm id={system.id} action={deleteSystemAction}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropDownItem route={`/systems/${system.id}`} module="systems" level="read">
                          View
                        </DropDownItem>
                        <DropDownItem form={system.id} type="submit" variant="destructive" module="systems" level="full">
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
      </Card>
    </div>
  );
}