import { TabsContent } from "@/lib/components/ui/tabs";
import { Controls } from "@/lib/schema/database";
import EditControlForm from "../forms/edit-control-form";
import { editControlAction } from "@/lib/actions/system-actions";
import { createClient } from "@/utils/supabase/server";
import { getControlsToNSTSubcategories, getControlToNSTSubcategories, getNISTSubcategories } from "@/lib/client/db";

type Props = {
  control: Controls;
}

export default async function ControlSettingsTab({ control }: Props) {
  const supabase = await createClient();
  const nst_subcategories = await getNISTSubcategories(supabase);
  const control_to_subcategories = await getControlToNSTSubcategories(supabase, control.id);

  return (
    <TabsContent value="settings" className="pt-4">
      <EditControlForm
        control={control}
        nst_subcategories={nst_subcategories}
        mapped_subcategories={control_to_subcategories}
        action={editControlAction} />
    </TabsContent>
  );
}