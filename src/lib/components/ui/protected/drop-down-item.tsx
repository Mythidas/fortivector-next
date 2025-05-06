'use client'

import { DropdownMenuItem } from "@/lib/components/ui/dropdown-menu";
import { hasAccess, useUser } from "@/lib/context/user-context";
import { AccessLevel, AccessModule } from "@/lib/types";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  module: AccessModule;
  level: AccessLevel;
  route?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
  inset?: boolean;
  variant?: "default" | "destructive";
  disabled?: boolean
} & React.ComponentProps<typeof DropdownMenuItem>

export default function DropDownItem({ module, level, route, onClick, className, inset, variant, disabled, ...props }: Props) {
  const router = useRouter();
  const context = useUser();

  return (
    <DropdownMenuItem
      className={className}
      inset={inset}
      variant={variant}
      disabled={disabled || !hasAccess(context, module, level)}
      onClick={(e) => { onClick && onClick(e); (route && hasAccess(context, module, level)) && router.push(route); }}
      {...props}
    >

    </DropdownMenuItem>
  );
}