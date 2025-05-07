
import { TabsContent } from "@/lib/components/ui/tabs";
import { Clients, Sites, Systems } from "@/lib/schema/database";
import SiteSystemsTable from "../tables/site-systems-table";
import { createClient } from "@/utils/supabase/server";
import { getSiteSytemViews } from "@/lib/client/db";

type Props = {
  site: Sites;
}

export default async function SiteSystemsTab({ site }: Props) {
  const supabase = await createClient();
  const site_systems = await getSiteSytemViews(supabase, site.id);

  return (
    <TabsContent value="systems">
      <SiteSystemsTable site={site} systems={site_systems} />
    </TabsContent>
  );
}