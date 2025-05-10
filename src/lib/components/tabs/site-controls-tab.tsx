import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { Card, CardContent, CardHeader } from "../ui/card";
import { createClient } from "@/utils/supabase/server";
import { getSiteControlsView } from "@/utils/server/db";
import { SiteSystemsView } from "@/lib/schema/views";
import SiteControlsTable from "../tables/site-controls-table";

type Props = {
  system_view: SiteSystemsView;
}

export default async function SiteControlsTab({ system_view }: Props) {
  const supabase = await createClient();
  const site_controls_views = await getSiteControlsView(supabase, system_view.site_id, system_view.link_id);
  if (!site_controls_views) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch controls. Contact support.
        </CardHeader>
      </Card>
    )
  }

  return (
    <TabsContent value="controls" className="flex flex-col gap-2 size-full">
      <Card>
        <CardContent>
          <SiteControlsTable controls_view={site_controls_views} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}