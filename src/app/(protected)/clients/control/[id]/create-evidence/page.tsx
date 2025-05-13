import { createControlEvidenceAction } from "@/lib/actions/controls";
import ControlEvidenceForm from "@/lib/components/forms/control-evidence-form";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import { Card, CardHeader } from "@/lib/components/ui/card";
import { getClient } from "@/lib/functions/database/clients";
import { getControlEvidenceRequirements, getSiteControlView } from "@/lib/functions/database/controls";
import { getSite } from "@/lib/functions/database/sites";
import { createClient } from "@/utils/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
}

export default async function CreateEvidence(props: Props) {
  const params = await props.params;
  const supabase = await createClient();
  const control = await getSiteControlView(supabase, params.id);
  const site = await getSite(supabase, control?.site_id || "");
  const client = await getClient(supabase, site?.client_id || "");
  const evidenceRequirements = await getControlEvidenceRequirements(supabase, control?.control_id || "")

  if (!control || !site || !client || !evidenceRequirements) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch data. Contact support.
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/${client.id}`}>{client.name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/site/${site.id}`}>{site.name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/control/${control.site_control_id}`}>{control.title}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Add Evidence</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <ControlEvidenceForm
        evidence={{
          id: control.site_control_id,
          tenant_id: site.tenant_id,
          site_control_id: control.site_control_id,
          name: "",
          description: "",
          evidence_url: "",
          evidence_requirement_id: "",
          uploaded_at: "",
          uploaded_by: "",
          approved_at: "",
          approved_by: ""
        }}
        requirements={evidenceRequirements}
        footer={{
          submit_text: "Add Evidence",
          pending_text: "Adding Evidence...",
          cancel_route: `/clients/control/${control.site_control_id}?tab=evidence`
        }}
        action={createControlEvidenceAction}
      />
    </div>
  );
}