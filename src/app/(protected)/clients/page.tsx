import { getClients } from "@/lib/client/db";
import ClientsTable from "@/lib/components/clients-table";
import { createClient } from "@/utils/supabase/server";

export default async function ClientsPage() {
  const supabase = await createClient();
  const clients = await getClients(supabase);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
      </div>

      <ClientsTable clients={clients} />
    </div>
  );
}