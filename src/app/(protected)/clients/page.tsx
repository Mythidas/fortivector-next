import ClientsTable from "@/lib/components/tables/clients-table";
import { getClients } from "@/lib/functions/database/clients";
import { getSites } from "@/lib/functions/database/sites";
import { createClient } from "@/utils/supabase/server";

export default async function ClientsPage() {
  const supabase = await createClient();
  const clients = await getClients(supabase);
  const sites = await getSites(supabase);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
      </div>

      <ClientsTable clients={clients} sites={sites} />
    </div>
  );
}