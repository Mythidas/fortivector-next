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
import { Joystick, MoreHorizontal } from "lucide-react";
import RouteButton from "@/lib/components/ux/route-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Systems } from "@/lib/schema/database/systems";
import { ControlEvidenceRequirements, Controls, ControlsToNSTSubcategories } from "@/lib/schema/database/controls";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/lib/components/ui/dropdown-menu";
import DeleteForm from "@/lib/components/forms/delete-form";
import { Button } from "@/lib/components/ui/button";
import DropDownItem from "@/lib/components/ux/drop-down-item";
import { deleteSystemAction } from "@/lib/actions/systems";
import { deleteControlAciton } from "@/lib/actions/controls";

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
                <TableHead>Review Frequency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>{control_evidence.filter((ev) => ev.control_id === control.id).length}</TableCell>
                  <TableCell>{controls_to_subcategories.filter((cat) => cat.control_id === control.id).length}</TableCell>
                  <TableCell>{control.review_frequency} days</TableCell>
                  <TableCell className="text-right">
                    <DeleteForm id={control.id} url={`/systems/${system.id}?tab=controls`} action={deleteControlAciton}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropDownItem route={`/systems/control/${control.id}`} module="controls" level="read">
                            View
                          </DropDownItem>
                          <DropDownItem form={control.id} type="submit" variant="destructive" module="controls" level="full">
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