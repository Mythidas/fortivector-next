'use client';

import React from "react";
import { Button } from "@/lib/components/ui/button";
import { useRouter } from "next/navigation";
import { AccessLevel, AccessModule } from "@/lib/types";
import { hasAccess, useUser } from "@/lib/context/user-context";
import { Download } from "lucide-react";

type Props = {
  fileUrl: string;
  fileName: string;
  module?: AccessModule;
  level?: AccessLevel;
  disabled?: boolean;
} & React.ComponentProps<typeof Button>; // inherit all Button props

export default function DownloadButton({ fileUrl, fileName, module, level, disabled, ...props }: Props) {
  const router = useRouter();
  const context = useUser();
  const access = (module && level && !hasAccess(context, module, level));

  const handleDownload = async () => {
    const res = await fetch(fileUrl);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={() => handleDownload()} disabled={disabled || access} {...props}>
      <Download className="mr-2 h-4 w-4" />
      Download File
    </Button>
  );
}