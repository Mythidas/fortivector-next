'use client';

import { TabsContent } from "@/lib/components/ui/tabs";
import { Input } from "@/lib/components/ui/input";
import { Button } from "@/lib/components/ui/button";
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
import { Avatar, AvatarFallback } from "@/lib/components/ui/avatar";
import { Joystick, MoreHorizontal, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import RouteButton from "@/lib/components/protected/route-button";
import { Controls, ControlsToNSTSubcategories, Systems } from "@/lib/schema/database";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteControl } from "@/lib/server/db";
import DropDownItem from "@/lib/components/protected/drop-down-item";

type Props = {
  system: Systems;
  controls: Controls[];
  controls_to_subcategories: ControlsToNSTSubcategories[]
}

export default function ControlsTab({ system, controls, controls_to_subcategories }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filterControls(control: Controls) {
    const lowerSearch = search.toLowerCase();
    const lowerName = control.title.toLowerCase();
    const lowerDescription = control.description.toLowerCase();
    return lowerName.includes(lowerSearch) || lowerDescription.includes(lowerSearch);
  }

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this control?");
    if (!confirm) return;

    const result = await deleteControl(id); // Change to delete control

    if (!result) {
      alert("Failed to delete control.");
    } else {
      router.push(`/systems/${system.id}?tab=controls`);
    }
  };

  function pascalCase(str: string) {
    return str[0].toUpperCase() + str.substring(1);
  }

  return (
    <TabsContent value="controls">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            placeholder="Search Controls..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <RouteButton route={`/systems/${system.id}/create-control`} module="controls" level="edit">
          <Joystick className="h-4 w-4 mr-2" />
          Add Control
        </RouteButton>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableCaption>Total Controls: {controls.length}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revision</TableHead>
                <TableHead>Enforcement Method</TableHead>
                <TableHead>Evidence Required</TableHead>
                <TableHead>NIST Subcategories</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controls.filter(filterControls).map((control) => (
                <TableRow key={control.id}>
                  <TableCell>{control.control_code}</TableCell>
                  <TableCell>{control.title}</TableCell>
                  <TableCell>{pascalCase(control.status)}</TableCell>
                  <TableCell>{control.revision}</TableCell>
                  <TableCell>{pascalCase(control.enforcement_method)}</TableCell>
                  <TableCell>{control.evidence_requirements?.length || 0}</TableCell>
                  <TableCell>{controls_to_subcategories.filter((cat) => cat.control_id === control.id).length}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropDownItem onClick={() => router.push(`/systems/control/${control.id}`)} module="controls" level="edit">
                          Edit
                        </DropDownItem>
                        <DropDownItem className="text-red-600" onClick={() => handleDelete(control.id)} module="controls" level="edit">
                          Delete
                        </DropDownItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
}