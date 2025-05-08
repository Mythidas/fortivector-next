import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import * as db from "@/lib/server/db";
import RouteButton from "@/lib/components/ui/protected/route-button";
import { FormMessage, Message } from "@/lib/components/form-message";
import SystemForm from "@/lib/components/forms/system-form";
import { createSystemAction } from "@/lib/actions/system-actions";

export default async function CreateSystem(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const tenant = await db.getTenant(supabase);

  if (!tenant) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch tenant. Contact support.
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <RouteButton
          variant="ghost"
          size="sm"
          className="mr-2"
          route="/systems"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </RouteButton>
        <h1 className="text-2xl font-bold tracking-tight">Create New System</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Enter the details for the new system.
          </CardDescription>
          <FormMessage message={searchParams} />
        </CardHeader>
        <CardContent>
          <SystemForm
            system={{
              id: "",
              tenant_id: tenant.id,
              name: "",
              is_system_defined: false
            }}
            cancel_route="/systems"
            submit_text="Create System"
            pending_text="Creating System..."
            action={createSystemAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}