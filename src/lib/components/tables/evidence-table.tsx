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
import { Joystick, MoreHorizontal, Newspaper } from "lucide-react";
import RouteButton from "@/lib/components/ux/route-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ControlEvidenceView, SiteControlsView } from "@/lib/schema/views";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/lib/components/ui/dropdown-menu";
import DeleteForm from "@/lib/components/forms/delete-form";
import { Button } from "@/lib/components/ui/button";
import DropDownItem from "@/lib/components/ux/drop-down-item";
import { deleteControlEvidenceAction } from "@/lib/actions/controls";

type Props = {
  controlView: SiteControlsView;
  evidence: ControlEvidenceView[];
}

export default function EvidenceTable({ controlView, evidence }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filterEvidence(evidence: ControlEvidenceView) {
    const lowerSearch = search.toLowerCase();
    const lowerName = evidence.name.toLowerCase();
    const lowerDescription = evidence.requirement_type.toLowerCase();
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
            placeholder="Search Evidence..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <RouteButton route={`/clients/control/${controlView.site_control_id}/create-evidence`} module="evidence" level="edit">
          <Newspaper className="h-4 w-4 mr-2" />
          Add Evidence
        </RouteButton>
      </div>

      <Card className="py-2">
        <CardContent className="p-0">
          <Table>
            <TableCaption>Total Evidence: {evidence.length}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evidence.filter(filterEvidence).map((evidence) => (
                <TableRow key={evidence.evidence_id}>
                  <TableCell>{evidence.name}</TableCell>
                  <TableCell>{pascalCase(evidence.requirement_type)}</TableCell>
                  <TableCell>{new Date(evidence.uploaded_at).toDateString()}</TableCell>
                  <TableCell>{evidence.email}</TableCell>
                  <TableCell className="text-right">
                    <DeleteForm id={evidence.evidence_id} url={`/clients/control/${controlView.site_control_id}?tab=evidence`} action={deleteControlEvidenceAction}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropDownItem route={`/clients/evidence/${evidence.evidence_id}`} module="evidence" level="read">
                            View
                          </DropDownItem>
                          <DropDownItem form={evidence.evidence_id} type="submit" variant="destructive" module="evidence" level="full">
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