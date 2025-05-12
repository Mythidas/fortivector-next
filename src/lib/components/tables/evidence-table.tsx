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
import { Joystick, Newspaper } from "lucide-react";
import RouteButton from "@/lib/components/ux/route-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ControlEvidenceView, SiteControlsView } from "@/lib/schema/views";

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {evidence.filter(filterEvidence).map((evidence) => (
                <TableRow
                  key={evidence.evidence_id}
                  className="hover:cursor-pointer"
                  onClick={() => router.push(`/clients/evidence/${evidence.evidence_id}`)}
                >
                  <TableCell>{evidence.name}</TableCell>
                  <TableCell>{pascalCase(evidence.requirement_type)}</TableCell>
                  <TableCell>{new Date(evidence.uploaded_at).toDateString()}</TableCell>
                  <TableCell>{evidence.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}