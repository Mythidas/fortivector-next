import { TabsContent } from "@/lib/components/ui/tabs";
import ControlsTable from "../tables/controls-table";
import { createClient } from "@/utils/supabase/server";
import { Systems } from "@/lib/schema/database/systems";
import { getControlsBySystem, getControlsEvidenceRequirements, getControlsToNSTSubcategories } from "@/lib/functions/database/controls";

type Props = {
  system: Systems;
}

export default async function ControlsTab({ system }: Props) {
  const supabase = await createClient();
  const controls = await getControlsBySystem(supabase, system.id);
  const control_evidence = await getControlsEvidenceRequirements(supabase, controls.map((row) => row.id));
  const controls_to_subcategories = await getControlsToNSTSubcategories(supabase);

  return (
    <TabsContent value="controls">
      <ControlsTable
        system={system}
        controls={controls}
        control_evidence={control_evidence}
        controls_to_subcategories={controls_to_subcategories}
      />
    </TabsContent>
  );
}