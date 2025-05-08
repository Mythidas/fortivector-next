import { TabsContent } from "@/lib/components/ui/tabs";
import { Controls } from "@/lib/schema/database";
import { editControlAction } from "@/lib/actions/system-actions";
import { createClient } from "@/utils/supabase/server";
import ControlForm from "../forms/control-form";
import { Card, CardContent } from "../ui/card";

type Props = {
  control: Controls;
}

export default async function ControlSettingsTab({ control }: Props) {
  const supabase = await createClient();

  return (
    <TabsContent value="settings" className="pt-4">
      <Card>
        <CardContent>
          <ControlForm
            control={control}
            pending_text="Updating Control..."
            submit_text="Update Control"
            action={editControlAction}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}