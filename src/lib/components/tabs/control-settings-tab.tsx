import { TabsContent } from "@/lib/components/ui/tabs";
import { deleteControlAction, editControlAction } from "@/lib/actions/system-actions";
import { createClient } from "@/utils/supabase/server";
import ControlForm from "../forms/control-form";
import { Card, CardContent, CardHeader } from "../ui/card";
import DeleteForm from "../forms/delete-form";
import { Separator } from "../ui/separator";
import { Controls } from "@/lib/schema/database/controls";

type Props = {
  control: Controls;
}

export default async function ControlSettingsTab({ control }: Props) {
  const supabase = await createClient();

  return (
    <TabsContent value="settings" className="flex flex-col w-full gap-2">
      <Card>
        <CardContent>
          <ControlForm
            control={control}
            footer={{
              pending_text: "Updating Control...",
              submit_text: "Update Control"
            }}
            action={editControlAction}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="!py-0">
          Actions
        </CardHeader>
        <CardContent className="flex flex-col w-full gap-2">
          <DeleteForm
            id={control.id}
            action={deleteControlAction}
            footer={{
              pending_text: `Deleting: ${control.title}`,
              submit_text: `Delete: ${control.title}`
            }}
            url={`/systems/${control.system_id}?tab=controls`}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}