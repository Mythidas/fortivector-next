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
import * as db from "@/lib/client/db";
import { FormMessage, Message } from "@/lib/components/form-message";
import { createInviteAction } from "@/lib/actions/user-actions";
import CreateUserForm from "@/lib/components/forms/create-user-form";
import { createControlAction } from "@/lib/actions/system-actions";
import CreateControlForm from "@/lib/components/forms/create-control-form";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<Message>;
type Props = {
  params: Params;
  searchParams: SearchParams;
};

export default async function CreateControl(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const system = await db.getSystem(supabase, params.id);
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
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Control Information</CardTitle>
          <CardDescription>
            Enter the details for the new control.
          </CardDescription>
          <FormMessage message={searchParams} />
        </CardHeader>
        <CardContent>
          <CreateControlForm system={system} action={createControlAction} />
        </CardContent>
      </Card>
    </div>
  );
}
