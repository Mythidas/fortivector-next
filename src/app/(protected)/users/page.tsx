import { getRoles, getUserInvites, getUsers } from "@/utils/server/db";
import { createClient } from "@/utils/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import UsersTable from "@/lib/components/tables/users-table";
import RolesTable from "@/lib/components/tables/roles-table";
import InvitesTable from "@/lib/components/tables/invites-table";

type Props = {
  searchParams: Promise<{ tab: string }>;
}

export default async function UsersPage({ searchParams }: Props) {
  const supabase = await createClient();
  const users = await getUsers(supabase);
  const roles = await getRoles(supabase);
  const invites = await getUserInvites(supabase);
  const sParams = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users & Roles</h1>
      </div>

      <Tabs defaultValue={sParams.tab || "users"} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UsersTable users={users} roles={roles} />
        </TabsContent>
        <TabsContent value="roles">
          <RolesTable users={users} roles={roles} />
        </TabsContent>
        <TabsContent value="invites">
          <InvitesTable invites={invites} roles={roles} />
        </TabsContent>
      </Tabs>
    </div>
  );
}