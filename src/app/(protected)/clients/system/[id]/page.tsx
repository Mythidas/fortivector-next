import { createClient } from "@/utils/supabase/server";
import { Tabs, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import { Card, CardHeader } from "@/lib/components/ui/card";
import SiteSystemControlsTab from "@/lib/components/tabs/site-systems-controls-tab";
import { getClient } from "@/lib/functions/database/clients";
import { getSite, getSiteSytemView } from "@/lib/functions/database/sites";
import RouteTabsTrigger from "@/lib/components/ux/route-tabs-trigger";

type SearchParams = Promise<{ tab: string }>;
type Params = Promise<{ id: string }>;
type Props = {
  params: Params;
  searchParams: SearchParams;
}

export default async function SitePage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const system_view = await getSiteSytemView(supabase, params.id);
  const site = await getSite(supabase, system_view?.site_id || "");
  const client = await getClient(supabase, site?.client_id || "");

  if (!site || !client || !system_view) {
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
          <BreadcrumbLink href={`/clients/${client.id}?tab=sites`}>{client.name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/site/${site.id}?tab=systems`}>{site.name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{system_view.system_name}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs defaultValue={searchParams.tab || "overview"} className="w-full">
        <div className="flex gap-4 justify-start items-end">
          <h1 className="text-3xl font-bold tracking-tight">{system_view.system_name}</h1>
        </div>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <RouteTabsTrigger value="overview">Overview</RouteTabsTrigger>
          <RouteTabsTrigger value="controls">Controls</RouteTabsTrigger>
          <RouteTabsTrigger value="settings">Settings</RouteTabsTrigger>
        </TabsList>
        <SiteSystemControlsTab site_view={system_view} />
      </Tabs>
    </div>
  );
}