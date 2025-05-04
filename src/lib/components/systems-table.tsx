'use client';

import { Input } from "@/lib/components/ui/input";
import { Button } from "@/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { FolderCog, MoreHorizontal, ShieldCheck, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import RouteButton from "@/lib/components/protected/route-button";
import { useState } from "react";
import { Systems } from "@/lib/schema/database";
import { useRouter } from "next/navigation";

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
        <RouteButton route="/systems/create">
          <FolderCog className="h-4 w-4 mr-2" />
          Add System
        </RouteButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {systems.filter(filter).map((system) => (
          <Card key={system.id} className="justify-between">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{system.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled={!system.tenant_id} onClick={() => router.push(`/systems/${system.id}`)}>
                      Edit System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{system.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}