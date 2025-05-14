import { TabsContent } from "@/lib/components/ui/tabs";
import { getControlEvidenceViewBySiteAndControl } from "@/lib/functions/database/controls";
import { SiteControlsView } from "@/lib/schema/views";
import { createClient } from "@/utils/supabase/server";

type Props = {
  controlView: SiteControlsView;
}

export default async function SiteControlOverviewTab(props: Props) {
  const supabase = await createClient();
  const controlEvidence = await getControlEvidenceViewBySiteAndControl(supabase, props.controlView.control_id, props.controlView.site_id);

  return (
    <TabsContent value="overview">
      Overview
    </TabsContent>
  );
}