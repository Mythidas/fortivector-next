import WaiversTable from "@/lib/components/tables/waivers-table";
import { TabsContent } from "@/lib/components/ui/tabs";
import { getControlWaiversViewByControl } from "@/lib/functions/database/controls";
import { SiteControlsView } from "@/lib/schema/views";
import { createClient } from "@/utils/supabase/server";

type Props = {
  controlView: SiteControlsView;
}

export default async function SiteControlWaiversTab(props: Props) {
  const supabase = await createClient();
  const waivers = await getControlWaiversViewByControl(supabase, props.controlView.site_control_id);

  return (
    <TabsContent value="waivers">
      <WaiversTable controlView={props.controlView} waivers={waivers} />
    </TabsContent>
  );
}