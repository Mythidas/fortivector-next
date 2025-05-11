import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { createClient } from "@/utils/supabase/server";

import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import CreateSystemLinkForm from "@/lib/components/forms/create-system-link-form";
import { createSiteSystemLinksAction } from "@/lib/actions/client-actions";
import { getClient, getSite } from "@/lib/functions/database/clients";
import { getSystems } from "@/lib/functions/database/systems";

type Props = {
  params: Promise<{ id: string }>;

}

export default async function LinkSystem(props: Props) {
  const params = await props.params;
  const supabase = await createClient();
  const site = await getSite(supabase, params.id);
  const client = await getClient(supabase, site?.client_id || "")
  const systems = await getSystems(supabase);
  if (!site || !client || !systems) {
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
          <BreadcrumbLink href={`/clients/${site.client_id}?tab=sites`}>{client.name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/site/${site.id}?tab=systems`}>{site.name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Link System</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Systems Information</CardTitle>
          <CardDescription>
            Enter the details for the new system link.
          </CardDescription>

        </CardHeader>
        <CardContent>
          <CreateSystemLinkForm site={site} systems={systems} action={createSiteSystemLinksAction} />
        </CardContent>
      </Card>
    </div>
  );
}