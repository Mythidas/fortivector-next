import { createClient } from "@/utils/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import { Card, CardHeader } from "@/lib/components/ui/card";
import ClientSitesTab from "@/lib/components/tabs/client-sites-tab";
import { getClient, getSites } from "@/lib/functions/database/clients";

type SearchParams = Promise<{ tab: string }>;
type Params = Promise<{ id: string }>;
type Props = {
  params: Params;
  searchParams: SearchParams;
}

export default async function ClientPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const client = await getClient(supabase, params.id);
  if (!client) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch client. Contact support.
        </CardHeader>
      </Card>
    )
  }
  const sites = await getSites(supabase, client?.id);
  // TODO move sites pull to the Client Sites tab

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{client.name}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs defaultValue={searchParams.tab || "overview"} className="w-full">
        <div className="flex gap-4 justify-start items-end">
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
        </div>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <ClientSitesTab client={client} sites={sites} />
      </Tabs>
    </div>
  );
}