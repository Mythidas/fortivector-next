'use client';

import React from "react";
import { Button } from "@/lib/components/ui/button";
import { useRouter } from "next/navigation";
import { AccessLevel, AccessModule } from "@/lib/types";
import { hasAccess, useUser } from "@/lib/context/user-context";

type RouteButtonProps = {
  route: string;
  children: React.ReactNode;
  module?: AccessModule;
  level?: AccessLevel;
  disabled?: boolean;
} & React.ComponentProps<typeof Button>; // inherit all Button props

export default function RouteButton({ route, children, module, level, disabled, ...props }: RouteButtonProps) {
  const router = useRouter();
  const context = useUser();

  return (
    <Button onClick={() => router.push(route)} {...props} disabled={disabled || (module && level && !hasAccess(context, module, level))}>
      {children}
    </Button>
  );
}