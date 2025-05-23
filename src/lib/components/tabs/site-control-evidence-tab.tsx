import EvidenceTable from "@/lib/components/tables/evidence-table";
import { TabsContent } from "@/lib/components/ui/tabs";
import { getControlEvidenceViewBySiteAndControl } from "@/lib/functions/database/controls";
import { SiteControlsView } from "@/lib/schema/views";
import { createClient } from "@/utils/supabase/server";

type Props = {
  controlView: SiteControlsView;
}

export default async function SiteControlEvidenceTab(props: Props) {
  const supabase = await createClient();
  const controlEvidence = await getControlEvidenceViewBySiteAndControl(supabase, props.controlView.control_id, props.controlView.site_id);

  return (
    <TabsContent value="evidence">
      <EvidenceTable controlView={props.controlView} evidence={controlEvidence} />
    </TabsContent>
  );
}