import SystemsTable from "@/lib/components/tables/systems-table";
import { getSystems } from "@/lib/functions/database/systems";
import { createClient } from "@/utils/supabase/server";

export default async function Systems() {
  const supabase = await createClient();
  const systems = await getSystems(supabase);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Systems</h1>
      </div>

      <SystemsTable systems={systems} />
    </div>
  );
}