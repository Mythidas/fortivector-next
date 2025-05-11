import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import ControlEvidenceForm from "../forms/control-evidence-form";
import { updateEvidenceRequirementsAction } from "@/lib/actions/system-actions";
import { Card, CardContent, CardHeader } from "../ui/card";
import { createClient } from "@/utils/supabase/server";
import { Controls } from "@/lib/schema/database/controls";
import { getControlEvidenceRequirements } from "@/lib/functions/database/controls";

type Props = {
  control: Controls
}

export default async function ControlEvidenceTab({ control }: Props) {
  const supabase = await createClient();
  const requirements = await getControlEvidenceRequirements(supabase, control.id);

  return (
    <TabsContent value="evidence" className="flex flex-col gap-2 size-full">
      <Card>
        <CardContent>
          <ControlEvidenceForm
            control={control}
            evidence={requirements}
            submit_text="Update Evidence"
            pending_text="Updating Evidence...."
            action={updateEvidenceRequirementsAction}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}