import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Separator } from "@/lib/components/ui/separator";
import { format } from "date-fns";
import { Download, Eye, FileText, File, Clock, User, Calendar } from "lucide-react";
import Image from "next/image";
import { getMediaType, getFileUrl } from "@/lib/functions/storage";
import { createClient } from "@/utils/supabase/server";
import { Breadcrumb, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/lib/components/ui/breadcrumb";
import { getClient } from "@/lib/functions/database/clients";
import { getControlEvidenceView } from "@/lib/functions/database/controls";
import DownloadButton from "@/lib/components/ux/download-button";

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
  const fileUrl = await getFileUrl(supabase, evidence.evidence_url);

  // Determine media type for appropriate rendering
  const mediaType = getMediaType(evidence.evidence_url);

  const handleDownload = async () => {
    const res = await fetch(fileUrl);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileUrl.split("/").pop() || "download";
    a.click();

    window.URL.revokeObjectURL(url);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evidence Viewer */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{evidence.name}</CardTitle>
              <Badge variant={evidence.approved_by ? 'default' : 'outline'}>
                {evidence.approved_by ? "Approved" : "Pending Review"}
              </Badge>
            </div>
            {evidence.description && (
              <CardDescription>{evidence.description}</CardDescription>
            )}
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
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
          <CardFooter className="flex justify-end p-4 gap-2">
            <Button variant="secondary" asChild>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                View Full Size
              </a>
            </Button>
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
                <div className="flex items-start">
                  <div className="w-5 h-5 mr-2 flex-shrink-0 text-muted-foreground">
                    <FileText className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{evidence.control_title}</p>
                    <p className="text-xs text-muted-foreground">Control</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-5 h-5 mr-2 flex-shrink-0 text-muted-foreground">
                    <Calendar className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {format(new Date(evidence.uploaded_at), "MMMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">Date Added</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Requirement Information */}
            {evidence.evidence_requirement_id && (
              <>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Requirement</h3>
                  <p className="text-sm">{evidence.requirement_description}</p>
                </div>
                <Separator />
              </>
            )}

            {/* System Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">System Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-start">
                  <div className="w-5 h-5 mr-2 flex-shrink-0 text-muted-foreground">
                    <FileText className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{evidence.system_name}</p>
                    <p className="text-xs text-muted-foreground">System</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-5 h-5 mr-2 flex-shrink-0 text-muted-foreground">
                    <FileText className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{evidence.site_name}</p>
                    <p className="text-xs text-muted-foreground">Site</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Audit Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Audit Information</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-start">
                  <div className="w-5 h-5 mr-2 flex-shrink-0 text-muted-foreground">
                    <User className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{evidence.email || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">Created By</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-5 h-5 mr-2 flex-shrink-0 text-muted-foreground">
                    <Clock className="w-full h-full" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {evidence.approved_at
                        ? format(new Date(evidence.approved_at), "MMMM d, yyyy")
                        : 'Not yet reviewed'}
                    </p>
                    <p className="text-xs text-muted-foreground">Last Reviewed</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}