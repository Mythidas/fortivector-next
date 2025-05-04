import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import * as db from "@/lib/client/db";
import RouteButton from "@/lib/components/protected/route-button";
import { FormMessage, Message } from "@/lib/components/form-message";
import { createInviteAction } from "@/lib/actions/user-actions";
import CreateSystemForm from "@/lib/components/forms/create-system-form";

export default async function CreateSystem(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const tenant = await db.getTenant(supabase);

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
          <CreateSystemForm tenantId={tenant?.id || ""} action={createInviteAction} />
        </CardContent>
      </Card>
    </div>
  );
}