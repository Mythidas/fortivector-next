import { createClient } from "@/utils/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/lib/components/ui/breadcrumb";
import { Card, CardContent, CardHeader } from "@/lib/components/ui/card";
import ControlsTab from "@/lib/components/tabs/controls-tab";
import SystemOverviewTab from "@/lib/components/tabs/system-overview-tab";
import SystemForm from "@/lib/components/forms/system-form";
import { deleteSystemAction, editSystemAction } from "@/lib/actions/system-actions";
import DeleteForm from "@/lib/components/forms/delete-form";
import { Separator } from "@/lib/components/ui/separator";
import { getSystem } from "@/lib/functions/database/systems";

type SearchParams = Promise<{ tab: string }>;
type Params = Promise<{ id: string }>;
type Props = {
  params: Params;
  searchParams: SearchParams;
}

export default async function SystemPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const system = await getSystem(supabase, params.id);
  if (!system) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch system. Contact support.
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
          <BreadcrumbPage>{system.name}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs defaultValue={searchParams.tab || "overview"} className="w-full">
        <div className="flex gap-4 justify-start items-end">
          <h1 className="text-3xl font-bold tracking-tight">{system.name}</h1>
          <span className="text-accent-foreground">{system.description}</span>
        </div>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <SystemOverviewTab />
        <ControlsTab system={system} />
        <TabsContent value="settings" className="flex flex-col gap-2 pt-4">
          <Card>
            <CardHeader>
              System Information
            </CardHeader>
            <CardContent>
              <SystemForm
                system={system}
                footer={{
                  submit_text: "Update System",
                  pending_text: "Updating System..."
                }}
                action={editSystemAction}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="!py-0">
              Actions
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Separator />
              <DeleteForm
                id={system.id}
                action={deleteSystemAction}
                pending_text={`Deleting: ${system.name}`}
                submit_text={`Delete: ${system.name}`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}