import UsersTable from "@/lib/components/tables/users-table";
import { TabsContent } from "@/lib/components/ui/tabs";
import { Roles, Users } from "@/lib/schema/database";

type Props = {
  users: Users[];
  roles: Roles[];
}

export default function UsersTab({ users, roles }: Props) {

  return (
    <TabsContent value="users">
      <UsersTable users={users} roles={roles} />
    </TabsContent>
  );
}