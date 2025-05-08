
import { TabsContent } from "@/lib/components/ui/tabs";
import { createClient } from "@/utils/supabase/server";
import { getSiteControlsView, getSiteSytemViews } from "@/lib/server/db";
import { SiteSystemsView } from "@/lib/schema/views";
import { Card, CardHeader } from "../ui/card";
import SiteControlsTable from "../tables/site-controls-table";

type Props = {
  site_view: SiteSystemsView;
}

export default async function SiteSystemControlsTab({ site_view }: Props) {
  const supabase = await createClient();
  const site_controls = await getSiteControlsView(supabase, site_view.site_id, site_view.system_id);
  if (!site_controls) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch controls. Contact support.
        </CardHeader>
      </Card>
    )
  }

  return (
    <TabsContent value="controls">
      <SiteControlsTable controls_view={site_controls} />
    </TabsContent>
  );
}