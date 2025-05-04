'use client'

import { DropdownMenuItem } from "@/lib/components/ui/dropdown-menu";
import { hasAccess, useUser } from "@/lib/context/user-context";
import { AccessLevel, AccessModule } from "@/lib/types";
import React from "react";

type Props = {
  module: AccessModule;
  level: AccessLevel;
  inset?: boolean;
  variant?: "default" | "destructive";
  disabled?: boolean
} & React.ComponentProps<typeof DropdownMenuItem>

export default function DropDownItem({ module, level, className, inset, variant, disabled, ...props }: Props) {
  const context = useUser();

  return (
    <DropdownMenuItem className={className} inset={inset} variant={variant} {...props} disabled={disabled || !hasAccess(context, module, level)}>

    </DropdownMenuItem>
  );
}