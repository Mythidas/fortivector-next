import { registerAction } from "@/lib/actions/auth-actions";
import { FormMessage } from "@/components/form-message";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { getUserInvite } from "@/lib/server/db";
import InviteForm from "@/components/invite-form";


export default async function Login(props: {
  searchParams: Promise<{
    invite: string;
    success: string;
    error: string;
    message: string
  }>
}) {
  const searchParams = await props.searchParams;

  if (searchParams.success) {
    return (
      <Card>
        <CardContent>
          <FormMessage message={searchParams} />
        </CardContent>
      </Card>
    );
  }

  const supabase = await createClient();
  const invite = await getUserInvite(supabase, searchParams.invite);

  if (!invite) {
    searchParams.message = "Invalid invite code"
    return (
      <Card>
        <CardContent>
          <FormMessage message={searchParams} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-1/3">
      <CardHeader>
        <CardTitle>Complete Invite</CardTitle>
        <FormMessage message={searchParams} />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 [&>input]:mb-3">
        <InviteForm inviteId={invite?.invite_token || ""} action={registerAction} />
      </CardContent>
    </Card>
  );
}
