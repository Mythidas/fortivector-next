'use client';

import { Input } from "@/lib/components/ui/input";
import {
  Card,
  CardContent,
} from "@/lib/components/ui/card";
import { FolderCog } from "lucide-react";
import RouteButton from "@/lib/components/ui/protected/route-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/lib/components/ui/table";
import { SiteControlsView } from "@/lib/schema/views";

interface Props {
  controls_view: SiteControlsView[]
}

export default function SiteControlsTable({ controls_view }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filter(control: SiteControlsView) {
    const lowerSearch = search.toLowerCase();
    const lowerName = control.title.toLowerCase();
    const lowerDescription = control.description?.toLowerCase() || "";
    const lowerCode = control.control_code.toLowerCase();
    return lowerName.includes(lowerSearch) || lowerDescription.includes(lowerSearch) || lowerCode.includes(lowerSearch);
  }

  function pascalCase(str: string) {
    return str[0].toUpperCase() + str.substring(1);
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
        <CardContent className="p-0">
          <Table>
            <TableCaption>Total Controls: {controls_view.length}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revision</TableHead>
                <TableHead>Enforcement</TableHead>
                <TableHead>Validated Date</TableHead>
                <TableHead>Validated By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controls_view.filter(filter).map((control) => (
                <TableRow key={control.control_id} className="hover:cursor-pointer" onClick={() => router.push(`/clients/site/${control.site_id}/${control.system_id}/${control.site_control_id}`)}>
                  <TableCell>{control.control_code}</TableCell>
                  <TableCell>{control.title}</TableCell>
                  <TableCell>{pascalCase(control.status)}</TableCell>
                  <TableCell>{control.revision}</TableCell>
                  <TableCell>{pascalCase(control.enforcement_method)}</TableCell>
                  <TableCell>{control.last_validated ? new Date(control.last_validated).getDate() : "Never"}</TableCell>
                  <TableCell>{control.last_validated_by}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}