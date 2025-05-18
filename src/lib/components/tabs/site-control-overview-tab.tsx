import { TabsContent } from "@/lib/components/ui/tabs";
import { getControlEvidenceRequirements, getControlEvidenceViewBySiteAndControl, getControlWaiversViewByControl } from "@/lib/functions/database/controls";
import { SiteControlsView } from "@/lib/schema/views";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Badge } from "@/lib/components/ui/badge";
import { CalendarDays, CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { format, addDays } from "date-fns";
import { pascalCase } from "@/lib/utils";
import StatusUpdateForm from "@/lib/components/forms/status-form";
import { updateSiteControlStatusAction } from "@/lib/actions/controls";

type Props = {
  controlView: SiteControlsView;
}

export default async function SiteControlOverviewTab(props: Props) {
  const supabase = await createClient();
  const controlEvidence = await getControlEvidenceViewBySiteAndControl(supabase, props.controlView.control_id, props.controlView.site_id);
  const controlWaivers = await getControlWaiversViewByControl(supabase, props.controlView.site_control_id);
  const controlRequirements = await getControlEvidenceRequirements(supabase, props.controlView.control_id);

  const waivedStatus = () => {
    for (const waiver of controlWaivers) {
      if (new Date(waiver.expiration).getTime() > new Date().getTime()) {
        return false;
      }
    }

    return true;
  }

  const approvedStatus = () => {
    let requirementsSatiated = controlRequirements.map((req) => { return { id: req.id, passed: false } });

    for (const evidence of controlEvidence) {
      const reviewed = new Date(evidence.reviewed_at);
      const expiration = new Date(reviewed.getTime() + props.controlView.review_frequency * 1000 * 60 * 60 * 24);

      if (expiration.getTime() > new Date().getTime() && evidence.status === "approved") {
        const requirement = requirementsSatiated.find((req) => req.id === evidence.evidence_requirement_id);
        if (requirement) requirement.passed = true;
      }
    }

    return requirementsSatiated.filter((req) => !req.passed).length > 0;
  }

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
  const nextReviewDate = props.controlView.last_validated
    ? addDays(new Date(props.controlView.last_validated), props.controlView.review_frequency)
    : new Date();

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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              {nextReviewDate && (
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">Change Status</div>
                  <StatusUpdateForm
                    id={props.controlView.site_control_id}
                    status={props.controlView.status}
                    options={[
                      { id: "onboarding", label: "Onboarding" },
                      { id: "implemented", label: "Implemented", disabled: approvedStatus() },
                      { id: "waived", label: "Waived", disabled: waivedStatus() }
                    ]}
                    action={updateSiteControlStatusAction}
                  />
                </div>
              )}
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
    </TabsContent>
  );
}