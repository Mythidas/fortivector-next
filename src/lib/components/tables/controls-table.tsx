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
import { Joystick, MoreHorizontal, UserPlus } from "lucide-react";
import RouteButton from "@/lib/components/ux/route-button";
import { ControlEvidenceRequirements, Controls, ControlsToNSTSubcategories, Systems } from "@/lib/schema/database";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteControl } from "@/utils/client/db";

type Props = {
  system: Systems;
  controls: Controls[];
  control_evidence: ControlEvidenceRequirements[];
  controls_to_subcategories: ControlsToNSTSubcategories[];
}

export default function ControlsTable({ system, controls, control_evidence, controls_to_subcategories }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filterControls(control: Controls) {
    const lowerSearch = search.toLowerCase();
    const lowerName = control.title.toLowerCase();
    const lowerDescription = control.description.toLowerCase();
    return lowerName.includes(lowerSearch) || lowerDescription.includes(lowerSearch);
  }

  function pascalCase(str: string) {
    return str[0].toUpperCase() + str.substring(1);
  }

  return (
    <>
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

      <Card className="py-2">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {controls.filter(filterControls).map((control) => (
                <TableRow key={control.id} className="hover:cursor-pointer" onClick={() => router.push(`/systems/control/${control.id}`)}>
                  <TableCell>{control.control_code}</TableCell>
                  <TableCell>{control.title}</TableCell>
                  <TableCell>{pascalCase(control.status)}</TableCell>
                  <TableCell>{control.revision}</TableCell>
                  <TableCell>{pascalCase(control.enforcement_method)}</TableCell>
                  <TableCell>{control_evidence.filter((ev) => ev.control_id === control.id).length}</TableCell>
                  <TableCell>{controls_to_subcategories.filter((cat) => cat.control_id === control.id).length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}