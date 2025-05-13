import { TabsContent } from "@/lib/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/lib/components/ui/card";
import SitesTable from "@/lib/components/tables/sites-table";
import { createClient } from "@/utils/supabase/server";
import { Clients } from "@/lib/schema/database/clients";
import { getSitesByClient } from "@/lib/functions/database/sites";

type Props = {
  client: Clients;
}

export default async function ClientSitesTab(props: Props) {
  const supabase = await createClient();
  const sites = await getSitesByClient(supabase, props.client.id);
  if (!sites) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch sites. Contact support.
        </CardHeader>
      </Card>
    )
  }

  return (
    <TabsContent value="sites">
      <SitesTable sites={sites} client={props.client} />
    </TabsContent>
  );
}