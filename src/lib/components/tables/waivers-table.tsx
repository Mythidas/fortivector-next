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
import { MoreHorizontal, Newspaper } from "lucide-react";
import RouteButton from "@/lib/components/ux/route-button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteControlsView } from "@/lib/schema/views";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/lib/components/ui/dropdown-menu";
import DeleteForm from "@/lib/components/forms/delete-form";
import { Button } from "@/lib/components/ui/button";
import DropDownItem from "@/lib/components/ux/drop-down-item";
import { deleteControlWaiverAction } from "@/lib/actions/controls";
import { Badge } from "@/lib/components/ui/badge";
import { ControlWaiversView } from "@/lib/schema/database/controls";

type Props = {
  controlView: SiteControlsView;
  waivers: ControlWaiversView[];
}

export default function WaiversTable({ controlView, waivers }: Props) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function filterWaiver(waiver: ControlWaiversView) {
    const lowerSearch = search.toLowerCase();
    const lowerReason = waiver.reason.toLowerCase();
    return waiver.status.includes(lowerSearch) || lowerReason.includes(lowerSearch);
  }

  function pascalCase(str: string) {
    return str[0].toUpperCase() + str.substring(1);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            placeholder="Search Waivers..."
            className="h-9"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <RouteButton route={`/clients/control/${controlView.site_control_id}/create-waiver`} module="waivers" level="edit">
          <Newspaper className="h-4 w-4 mr-2" />
          Add Waiver
        </RouteButton>
      </div>

      <Card className="py-2">
        <CardContent className="p-0">
          <Table>
            <TableCaption>Total Waivers: {waivers.length}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Updated By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waivers.filter(filterWaiver).map((waiver) => (
                <TableRow key={waiver.id}>
                  <TableCell>{waiver.reason}</TableCell>
                  <TableCell>
                    <Badge variant={waiver.status === "approved" ? 'default' : waiver.status === "pending" ? "outline" : "destructive"} className="text-sm">
                      {pascalCase(waiver.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={new Date(waiver.expiration).getTime() <= new Date().getTime() ? "destructive" : "default"} className="text-sm">
                      {new Date(waiver.expiration).toDateString()}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(waiver.created_at).toDateString()}</TableCell>
                  <TableCell>{waiver.updater || ""}</TableCell>
                  <TableCell className="text-right">
                    <DeleteForm id={waiver.id} url={`/clients/control/${controlView.site_control_id}?tab=waivers`} action={deleteControlWaiverAction}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropDownItem route={`/clients/waiver/${waiver.id}`} module="waivers" level="read">
                            View
                          </DropDownItem>
                          <DropDownItem form={waiver.id} type="submit" variant="destructive" module="waivers" level="full">
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