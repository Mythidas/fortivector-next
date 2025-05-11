import { TabsContent } from "@/lib/components/ui/tabs";
import ControlNISTForm from "../forms/control-nist-form";
import { updateControlNistAction } from "@/lib/actions/system-actions";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controls } from "@/lib/schema/database/controls";
import { getControlToNSTSubcategories } from "@/lib/functions/database/controls";
import { getNISTSubcategories } from "@/lib/functions/database/nist";

type Props = {
  control: Controls;
};

export default async function ControlNistTab({ control }: Props) {
  const supabase = await createClient();
  const control_subcats = await getControlToNSTSubcategories(supabase, control.id);
  const nst_subcategories = await getNISTSubcategories(supabase);
  if (!control_subcats || !nst_subcategories) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch data. Contact support.
        </CardHeader>
      </Card>
    )
  }

  return (
    <TabsContent value="nist" className="flex flex-col size-full gap-2">
      <Card>
        <CardContent>
          <ControlNISTForm
            control={control}
            control_subcats={control_subcats}
            nst_subcategories={nst_subcategories}
            pending_text="Updating NIST..."
            submit_text="Update NIST"
            action={updateControlNistAction}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
