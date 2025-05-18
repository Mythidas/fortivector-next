import { Badge } from "@/lib/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Separator } from "@/lib/components/ui/separator";
import { format } from "date-fns";
import { Download, Eye, FileText, File, Clock, User, Calendar, FileCode2, LucideProps } from "lucide-react";
import Image from "next/image";
import { getMediaType, getEvidenceFileUrl } from "@/lib/functions/storage";
import { createClient } from "@/utils/supabase/server";
import { Breadcrumb, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/lib/components/ui/breadcrumb";
import { getClient } from "@/lib/functions/database/clients";
import { getControlEvidenceView } from "@/lib/functions/database/controls";
import DownloadButton from "@/lib/components/ux/download-button";
import { pascalCase } from "@/lib/utils";
import StatusUpdateForm from "@/lib/components/forms/status-form";
import { updateControlEvidenceStatusAction } from "@/lib/actions/controls";

type Props = {
  params: Promise<{ id: string }>;
}

export default async function ClientEvidencePage(props: Props) {
  const params = await props.params;
  const supabase = await createClient();
  const evidence = await getControlEvidenceView(supabase, params.id);
  const client = await getClient(supabase, evidence?.client_id || "");

  if (!evidence || !client) {
    return (
      <Card>
        <CardHeader>
          Failed to fetch data. Contact support.
        </CardHeader>
      </Card>
    )
  }

  // Get the file URL from storage
  const fileUrl = await getEvidenceFileUrl(supabase, evidence.evidence_url);

  // Determine media type for appropriate rendering
  const mediaType = getMediaType(evidence.evidence_url);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/clients">Clients</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/${client.id}?tab=sites`}>{client.name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/site/${evidence.site_id}?tab=systems`}>{evidence.site_name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/system/${evidence.site_systems_id}?tab=controls`}>{evidence.system_name}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/clients/control/${evidence.site_control_id}?tab=evidence`}>{evidence.control_title}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{evidence.name}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Evidence Viewer */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{evidence.name}</CardTitle>
              <Badge variant={evidence.status === "approved" ? 'default' : evidence.status === "pending" ? "outline" : "destructive"} className="text-sm">
                {pascalCase(evidence.status)}
              </Badge>
            </div>
            {evidence.description && (
              <CardDescription>{evidence.description}</CardDescription>
            )}
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="flex items-center justify-center bg-muted/40 min-h-[400px] relative">
              {/* Media viewer based on file type */}
              {mediaType === 'image' && (
                <div className="relative w-full h-full min-h-[400px]">
                  <Image
                    src={fileUrl}
                    alt={evidence.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              )}

              {mediaType === 'pdf' && (
                <iframe
                  src={`${fileUrl}#view=FitH`}
                  className="w-full h-[600px]"
                  title={evidence.name}
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
                    <DownloadButton fileUrl={fileUrl} fileName={evidence.name} module="evidence" level="read">
                      Download File
                    </DownloadButton>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between items-center size-full py-0">
            <StatusUpdateForm
              id={evidence.id}
              status={evidence.status}
              label
              options={[
                { id: "pending", label: "Pending" },
                { id: "approved", label: "Approved" },
                { id: "denied", label: "Denied" }
              ]}
              action={updateControlEvidenceStatusAction}
            />
            <DownloadButton fileUrl={fileUrl} fileName={evidence.name} module="evidence" level="read">
              Download File
            </DownloadButton>
          </CardFooter>
        </Card>

        {/* Evidence Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Evidence Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Control Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Control Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <InfoFieldLocal detail={evidence.control_title} label="Control" icon={FileText} />
              </div>
            </div>

            <Separator />

            {/* Requirement Information */}
            {evidence.evidence_requirement_id && (
              <>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Requirement Information</h3>
                  <p className="text-sm">{evidence.requirement_description}</p>
                </div>
                <InfoFieldLocal detail={pascalCase(evidence.requirement_type)} label="Evidence Type" icon={FileCode2} />
                <Separator />
              </>
            )}

            {/* System Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">System Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <InfoFieldLocal detail={evidence.system_name} label="System" icon={FileText} />
                <InfoFieldLocal detail={evidence.site_name} label="Site" icon={FileText} />
              </div>
            </div>

            <Separator />

            {/* Audit Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Audit Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <InfoFieldLocal detail={evidence.email || "Unknown"} label="Created By" icon={User} />
                <InfoFieldLocal detail={format(new Date(evidence.uploaded_at), "MMMM d, yyyy")} label="Date Added" icon={Calendar} />
                <InfoFieldLocal detail={evidence.reviewer || "Unknown"} label="Reviewed By" icon={User} />
                <InfoFieldLocal detail={evidence.reviewed_at
                  ? format(new Date(evidence.reviewed_at), "MMMM d, yyyy")
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