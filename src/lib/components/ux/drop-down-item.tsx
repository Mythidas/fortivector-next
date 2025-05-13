'use client'

import { Button } from "@/lib/components/ui/button";
import { DropdownMenuItem } from "@/lib/components/ui/dropdown-menu";
import { SubmitButton } from "@/lib/components/ux/submit-button";
import { hasAccess, useUser } from "@/lib/context/user-context";
import { AccessLevel, AccessModule, FormState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  module: AccessModule;
  level: AccessLevel;
  route?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
  inset?: boolean;
  variant?: "default" | "destructive";
  disabled?: boolean;
  type?: "button" | "submit";
} & React.ComponentProps<typeof DropdownMenuItem>

export default function DropDownItem({ children, module, level, route, onClick, className, inset, variant, disabled, type, ...props }: Props) {
  const router = useRouter();
  const context = useUser();

  if (type === "submit") {
    return (
      <DropdownMenuItem
        className={cn(variant === "destructive" && "text-red-600", "w-full", className)}
        inset={inset}
        disabled={disabled || !hasAccess(context, module, level)}
        onClick={(e) => { onClick && onClick(e); (route && hasAccess(context, module, level)) && router.push(route); }}
        asChild
        {...props}
      >
        <Button type="submit" variant="ghost" className="flex !items-center !justify-start">
          {children}
        </Button>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      className={cn(variant === "destructive" && "text-red-600", "w-full", className)}
      inset={inset}
      disabled={disabled || !hasAccess(context, module, level)}
      onClick={(e) => { onClick && onClick(e); (route && hasAccess(context, module, level)) && router.push(route); }}
      {...props}
    >
      {children}
    </DropdownMenuItem>
  );
}