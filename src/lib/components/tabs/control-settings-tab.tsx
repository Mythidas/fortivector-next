import { TabsContent } from "@/lib/components/ui/tabs";
import { createClient } from "@/utils/supabase/server";
import ControlForm from "../forms/control-form";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controls } from "@/lib/schema/database/controls";
import { updateControlAction } from "@/lib/actions/controls";

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
            action={updateControlAction}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}