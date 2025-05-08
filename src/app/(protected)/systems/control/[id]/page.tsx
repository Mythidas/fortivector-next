import { getControl, getControls, getControlsToNSTSubcategories, getSystem } from "@/lib/server/db";
import { createClient } from "@/utils/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import { Card, CardHeader } from "@/lib/components/ui/card";
import ControlsTab from "@/lib/components/tabs/controls-tab";
import ControlSettingsTab from "@/lib/components/tabs/control-settings-tab";
import ControlEvidenceTab from "@/lib/components/tabs/control-evidence-tab";
import ControlNistTab from "@/lib/components/tabs/control-nist-tab";

type SearchParams = Promise<{ tab: string }>;
type Params = Promise<{ id: string }>;
type Props = {
  params: Params;
  searchParams: SearchParams;
}

export default async function SystemControlPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const control = await getControl(supabase, params.id);
  const system = await getSystem(supabase, control?.system_id || "");
  if (!control || !system) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch data. Contact support.
        </CardHeader>
      </Card>
    )
  }


  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/systems">Systems</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/systems/${system.id}?tab=controls`}>{system.name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{control.control_code}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs defaultValue={searchParams.tab || "overview"} className="w-full">
        <div className="flex gap-4 justify-start items-end">
          <h1 className="text-3xl font-bold tracking-tight">{control.control_code}</h1>
          <span className="text-accent-foreground">{control.title}</span>
        </div>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="nist">NIST</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <ControlSettingsTab control={control} />
        <ControlEvidenceTab control={control} />
      </Tabs>
    </div>
  );
}