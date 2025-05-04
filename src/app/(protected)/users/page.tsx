import { getRoles, getUserInvites, getUsers } from "@/lib/client/db";
import { createClient } from "@/utils/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import UsersTab from "@/lib/components/tabs/users-tab";
import RolesTab from "@/lib/components/tabs/roles-tab";
import InvitesTab from "@/lib/components/tabs/invites-tab";

export default async function UsersPage(props: { searchParams: Promise<{ tab: string }> }) {
  const supabase = await createClient();
  const users = await getUsers(supabase);
  const roles = await getRoles(supabase);
  const invites = await getUserInvites(supabase);
  const { data: currentUser } = await supabase.auth.getUser();
  const searchParams = await props.searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users & Roles</h1>
      </div>

      <Tabs defaultValue={searchParams.tab || "users"} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>
        <UsersTab users={users} roles={roles} currentUser={currentUser.user?.id || ""} />
        <RolesTab users={users} roles={roles} />
        <InvitesTab invites={invites} roles={roles} />
      </Tabs>
    </div>
  );
}