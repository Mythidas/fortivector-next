import { createControlWaiverAction } from "@/lib/actions/controls";
import ControlWaiverForm from "@/lib/components/forms/control-waiver-form";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import { Card, CardHeader } from "@/lib/components/ui/card";
import { getClient } from "@/lib/functions/database/clients";
import { getSiteControlView } from "@/lib/functions/database/controls";
import { getSite } from "@/lib/functions/database/sites";
import { createClient } from "@/utils/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
}

export default async function CreateWaiver(props: Props) {
  const params = await props.params;
  const supabase = await createClient();
  const control = await getSiteControlView(supabase, params.id);
  const site = await getSite(supabase, control?.site_id || "");
  const client = await getClient(supabase, site?.client_id || "");

  if (!control || !site || !client) {
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
          <BreadcrumbLink href={`/clients/system/${control.site_system_id}`}>{control.system_name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/control/${control.site_control_id}?tab=waivers`}>{control.title}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Add Waiver</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <ControlWaiverForm
        waiver={{
          id: control.site_control_id,
          tenant_id: site.tenant_id,
          site_id: control.site_id,
          site_control_id: control.site_control_id,
          status: "pending",
          reason: "",
          url: "",
          expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          created_at: "",
          created_by: "",
          updated_at: "",
          updated_by: ""
        }}
        footer={{
          submit_text: "Add Waiver",
          pending_text: "Adding Waiver...",
          cancel_route: `/clients/control/${control.site_control_id}?tab=waivers`
        }}
        action={createControlWaiverAction}
      />
    </div>
  );
}