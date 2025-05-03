import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import CreateUserForm from "@/components/create-user-form";
import { createClient } from "@/utils/supabase/server";
import * as db from "@/lib/server/db";
import RouteButton from "@/components/route-button";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { createUserAction } from "@/lib/actions/user-actions";
import { Button } from "@/components/ui/button";

export default async function CreateUser(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const roles = await db.getRoles(supabase);
  const tenant = await db.getTenant(supabase);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <RouteButton
          variant="ghost"
          size="sm"
          className="mr-2"
          route="/users"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </RouteButton>
        <h1 className="text-2xl font-bold tracking-tight">Create New User</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Enter the details for the new user account.
          </CardDescription>
          <CardFooter>
            <FormMessage message={searchParams} />
          </CardFooter>
        </CardHeader>
        <CardContent>
          <CreateUserForm tenantId={tenant?.id || ""} roles={roles} action={createUserAction} />
        </CardContent>
      </Card>
    </div>
  );
}