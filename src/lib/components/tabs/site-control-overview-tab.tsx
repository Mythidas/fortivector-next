import { TabsContent } from "@/lib/components/ui/tabs";
import { getControlEvidenceViewBySiteAndControl, getControlWaiversViewByControl } from "@/lib/functions/database/controls";
import { SiteControlsView } from "@/lib/schema/views";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Badge } from "@/lib/components/ui/badge";
import { CalendarDays, CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { format, addDays } from "date-fns";
import { pascalCase } from "@/lib/utils";
import { Separator } from "@/lib/components/ui/separator";

type Props = {
  controlView: SiteControlsView;
}

export default async function SiteControlOverviewTab(props: Props) {
  const supabase = await createClient();
  const controlEvidence = await getControlEvidenceViewBySiteAndControl(supabase, props.controlView.control_id, props.controlView.site_id);
  const controlWaivers = await getControlWaiversViewByControl(supabase, props.controlView.site_control_id);

  // Calculate next review date
  const nextReviewDate = props.controlView.last_validated
    ? addDays(new Date(props.controlView.last_validated), props.controlView.review_frequency)
    : new Date();

  // Helper to get status badge color and icon
  const getStatusBadge = (status: string): { variant: "default" | "destructive" | "secondary", icon: any } => {
    switch (status?.toLowerCase()) {
      case 'implemented':
        return { variant: "default", icon: <CheckCircle className="h-4 w-4 mr-1" /> };
      case 'waived':
        return { variant: "destructive", icon: <AlertTriangle className="h-4 w-4 mr-1" /> };
      default:
        return { variant: "secondary", icon: <Clock className="h-4 w-4 mr-1" /> };
    }
  };

  const statusBadge = getStatusBadge(props.controlView.status);

  return (
    <TabsContent value="overview" className="space-y-4 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Control Status Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Control Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Status</div>
                <Badge variant={statusBadge.variant} className="text-base font-medium flex items-center">
                  {statusBadge.icon}
                  {pascalCase(props.controlView.status) || "Not Set"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Revision</div>
                <div className="font-medium">{props.controlView.revision}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Enforcement Method</div>
                <div className="font-medium">{pascalCase(props.controlView.enforcement_method)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Schedule Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Review Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              {nextReviewDate && (
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Next Review</div>
                  <Badge className="text-base font-medium flex items-center" variant={nextReviewDate.getTime() <= new Date().getTime() ? "destructive" : "default"}>
                    <CalendarDays className="h-4 w-4 mr-1 text-blue-500" />
                    {format(nextReviewDate, 'MMM dd, yyyy')}
                  </Badge>
                </div>
              )}
              <div className="flex justify-between">
                <div className="text-sm text-gray-500">Review Frequency</div>
                <div className="font-medium">{props.controlView.review_frequency || "-"} days</div>
              </div>

              <div className="flex justify-between">
                <div className="text-sm text-gray-500">Last Reviewed</div>
                <div className="font-medium">
                  {props.controlView.last_validated
                    ? format(new Date(props.controlView.last_validated), 'MMM dd, yyyy')
                    : "Never"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Information */}
      <Card>
        <CardHeader>
          <CardTitle>Control Details</CardTitle>
          <CardDescription>Information about the control requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Control Code</h4>
              <p>{props.controlView.control_code}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Title</h4>
              <p>{props.controlView.title}</p>
            </div>
          </div>

          {props.controlView.description && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="text-sm mt-1 whitespace-pre-wrap">{props.controlView.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evidence Section */}
      {controlEvidence && controlEvidence.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evidence</CardTitle>
            <CardDescription>Supporting evidence for this control</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="divide-y">
              {controlEvidence.map((evidence, index) => (
                <div key={index} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{evidence.name || "Untitled Evidence"}</h4>
                      {evidence.description && <p className="text-sm text-gray-500">{evidence.description}</p>}
                    </div>
                    <div className="flex gap-2 items-center text-sm text-gray-500">
                      {evidence.uploaded_at && format(new Date(evidence.uploaded_at), 'MMM dd, yyyy')}
                      <Badge variant={evidence.status === "approved" ? 'default' : evidence.status === "pending" ? "outline" : "destructive"} className="text-sm">
                        {pascalCase(evidence.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
}