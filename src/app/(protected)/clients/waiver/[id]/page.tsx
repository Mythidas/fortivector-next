import { Badge } from "@/lib/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Separator } from "@/lib/components/ui/separator";
import { format } from "date-fns";
import { FileText, File, Clock, User, Calendar } from "lucide-react";
import Image from "next/image";
import { getMediaType, getWaiverFileUrl } from "@/lib/functions/storage";
import { createClient } from "@/utils/supabase/server";
import { Breadcrumb, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/lib/components/ui/breadcrumb";
import { getClient } from "@/lib/functions/database/clients";
import { getControlWaiversView, getSiteControlView } from "@/lib/functions/database/controls";
import DownloadButton from "@/lib/components/ux/download-button";
import { pascalCase } from "@/lib/utils";
import StatusUpdateForm from "@/lib/components/forms/status-form";
import { updateControlWaiverStatusAction } from "@/lib/actions/controls";
import { getSite, getSiteSytemView } from "@/lib/functions/database/sites";

type Props = {
  params: Promise<{ id: string }>;
}

export default async function ClientWaiverPage(props: Props) {
  const params = await props.params;
  const supabase = await createClient();
  const waiver = await getControlWaiversView(supabase, params.id);
  const control = await getSiteControlView(supabase, waiver?.site_control_id || "");
  const site = await getSite(supabase, control?.site_id || "");
  const client = await getClient(supabase, site?.client_id || "");
  const system = await getSiteSytemView(supabase, control?.site_system_id || "");

  if (!waiver || !client || !control || !site || !system) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch data. Contact support.
        </CardHeader>
      </Card>
    )
  }

  // Get the file URL from storage
  const fileUrl = await getWaiverFileUrl(supabase, waiver.url);

  // Determine media type for appropriate rendering
  const mediaType = getMediaType(waiver.url);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/${client.id}?tab=sites`}>{client.name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/site/${waiver.site_id}?tab=systems`}>{system.site_name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/system/${control?.site_system_id}?tab=controls`}>{control?.system_name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/control/${control?.site_control_id}?tab=waivers`}>{control?.title}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{waiver.reason}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evidence Viewer */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{waiver.reason}</CardTitle>
              <Badge variant={waiver.status === "approved" ? 'default' : waiver.status === "pending" ? "outline" : "destructive"} className="text-sm">
                {pascalCase(waiver.status)}
              </Badge>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <div className="flex items-center justify-center bg-muted/40 min-h-[400px] relative">
              {/* Media viewer based on file type */}
              {mediaType === 'image' && (
                <div className="relative w-full h-full min-h-[400px]">
                  <Image
                    src={fileUrl}
                    alt={waiver.reason}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              )}

              {mediaType === 'pdf' && fileUrl && (
                <iframe
                  src={`${fileUrl}#view=FitH`}
                  className="w-full h-[600px]"
                  title={waiver.reason}
                />
              )}

              {mediaType === 'video' && (
                <video
                  controls
                  className="max-w-full max-h-[600px]"
                >
                  <source src={fileUrl} />
                  Your browser does not support video playback.
                </video>
              )}

              {mediaType === 'other' && (
                <div className="flex flex-col items-center justify-center p-12">
                  <File className="h-16 w-16 text-muted-foreground mb-4" />
                  <div className="text-center">
                    <p className="font-medium">File Preview Not Available</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This file type cannot be previewed directly. Please download to view.
                    </p>
                    <DownloadButton fileUrl={fileUrl} fileName={waiver.reason} module="evidence" level="read">
                      Download File
                    </DownloadButton>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between gap-2">
            <StatusUpdateForm
              id={waiver.id}
              status={waiver.status}
              options={[
                { id: "pending", label: "Pending" },
                { id: "approved", label: "Approved" },
                { id: "denied", label: "Denied" }
              ]}
              action={updateControlWaiverStatusAction}
            />
            <DownloadButton fileUrl={fileUrl} fileName={waiver.reason} disabled={!fileUrl} module="evidence" level="read">
              Download File
            </DownloadButton>
          </CardFooter>
        </Card>

        {/* Evidence Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Waiver Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Control Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Control Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <InfoFieldLocal detail={control.title} label="Control" icon={FileText} />
              </div>
            </div>

            <Separator />

            {/* System Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">System Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <InfoFieldLocal detail={system.system_name} label="System" icon={FileText} />
                <InfoFieldLocal detail={system.site_name} label="Site" icon={FileText} />
              </div>
            </div>

            <Separator />

            {/* Audit Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Audit Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <InfoFieldLocal detail={waiver.creator || "Unknown"} label="Created By" icon={User} />
                <InfoFieldLocal detail={format(new Date(waiver.created_at), "MMMM d, yyyy")} label="Date Added" icon={Calendar} />
                <InfoFieldLocal detail={waiver.updater || "None"} label="Reviewed By" icon={User} />
                <InfoFieldLocal detail={waiver.updated_at
                  ? format(new Date(waiver.updated_at), "MMMM d, yyyy")
                  : 'Not yet reviewed'} label="Reviewed At" icon={Clock} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoFieldLocal(props: { detail: string, label: string, icon: any }) {
  return (
    <div className="flex items-start">
      <div className="my-auto w-5 h-5 mr-2 flex-shrink-0 text-muted-foreground">
        <props.icon className="w-full h-full" />
      </div>
      <div>
        <p className="font-medium text-sm">{props.detail}</p>
        <p className="text-xs text-muted-foreground">{props.label}</p>
      </div>
    </div>
  )
}