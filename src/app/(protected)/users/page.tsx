import { getRoles, getUserInvites, getUsers } from "@/lib/server/db";
import { createClient } from "@/utils/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersTab from "@/components/users-tab";
import RolesTab from "@/components/roles-tab";
import InvitesTab from "@/components/invites-tab";

export default async function UsersPage(props: { searchParams: Promise<{ tab: string }> }) {
  const supabase = await createClient();
  const users = await getUsers(supabase);
  const roles = await getRoles(supabase);
  const invites = await getUserInvites(supabase);
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
        <UsersTab users={users} roles={roles} />
        <RolesTab users={users} roles={roles} />
        <InvitesTab invites={invites} roles={roles} />
      </Tabs>
    </div>
  );
}