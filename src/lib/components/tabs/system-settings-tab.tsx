import { TabsContent } from "@/lib/components/ui/tabs";
import { Systems } from "@/lib/schema/database";
import EditSystemForm from "../forms/edit-system-form";
import { editSystemAction } from "@/lib/actions/system-actions";

type Props = {
  system: Systems;
}

export default function SystemSettingsTab({ system }: Props) {
  return (
    <TabsContent value="settings" className="pt-4">
      <EditSystemForm system={system} action={editSystemAction} />
    </TabsContent>
  );
}