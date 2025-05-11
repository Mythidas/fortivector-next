import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/lib/components/ui/breadcrumb";
import { createClient } from "@/utils/supabase/server";

import { createControlAction } from "@/lib/actions/system-actions";
import { Separator } from "@/lib/components/ui/separator";
import ControlForm from "@/lib/components/forms/control-form";
import { getSystem } from "@/lib/functions/database/systems";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CreateControl(props: Props) {
  const params = await props.params;
  const supabase = await createClient();
  const system = await getSystem(supabase, params.id);
  if (!system) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch system. Contact support.
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="flex flex-col size-full space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/systems">Systems</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/systems/${params.id}?tab=controls`}>{system.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Control</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="size-full">
        <CardHeader>
          <CardTitle>Control Information</CardTitle>
          <CardDescription>
            Enter the details for the new control.
          </CardDescription>

        </CardHeader>
        <Separator />
        <CardContent className="size-full">
          <ControlForm
            control={{
              id: "",
              control_code: "",
              title: "",
              status: "draft",
              revision: "",
              description: "",
              system_id: system.id,
              tenant_id: system.tenant_id,
              enforcement_method: "manual",
              enforcement_location: ""
            }}
            cancel_route={`/systems/${system.id}?tab=controls`}
            submit_text="Create Control"
            pending_text="Creating Control..."
            action={createControlAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}
