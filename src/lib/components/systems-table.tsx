'use client';

import { Input } from "@/lib/components/ui/input";
import {
  Card,
  CardContent,
} from "@/lib/components/ui/card";
import { FolderCog } from "lucide-react";
import RouteButton from "@/lib/components/ui/protected/route-button";
import { useState } from "react";
import { Systems } from "@/lib/schema/database";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/lib/components/ui/table";

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
              {systems.filter(filter).map((system) => (
                <TableRow key={system.id} className="hover:cursor-pointer" onClick={() => router.push(`/systems/${system.id}`)}>
                  <TableCell>{system.name}</TableCell>
                  <TableCell>{system.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}