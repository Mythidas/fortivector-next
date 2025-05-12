import SiteControlEvidenceTab from "@/lib/components/tabs/site-control-evidence-tab";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import { Card, CardHeader } from "@/lib/components/ui/card";
import { Tabs, TabsList } from "@/lib/components/ui/tabs";
import RouteTabsTrigger from "@/lib/components/ux/route-tabs-trigger";
import { getClient, getSite } from "@/lib/functions/database/clients";
import { getSiteControlView } from "@/lib/functions/database/controls";
import { createClient } from "@/utils/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab: string }>;
}

export default async function SiteControlPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const control = await getSiteControlView(supabase, params.id);
  const site = await getSite(supabase, control?.site_id || "");
  const client = await getClient(supabase, site?.client_id || "");
  if (!control || !site || !client) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch data. Contact Support.
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
          <BreadcrumbPage>{control.title}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs defaultValue={searchParams.tab || "overview"} className="w-full">
        <div className="flex gap-4 justify-start items-end">
          <h1 className="text-3xl font-bold tracking-tight">{control.title}</h1>
        </div>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <RouteTabsTrigger value="overview">Overview</RouteTabsTrigger>
          <RouteTabsTrigger value="evidence">Evidence</RouteTabsTrigger>
        </TabsList>
        <SiteControlEvidenceTab controlView={control} site={site} client={client} />
      </Tabs>
    </div>
  );
}