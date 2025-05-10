'use client';

import React from "react";
import { Button } from "@/lib/components/ui/button";
import { useRouter } from "next/navigation";
import { AccessLevel, AccessModule } from "@/lib/types";
import { hasAccess, useUser } from "@/lib/context/user-context";
import { TableRow } from "@/lib/components/ui/table";

type Props = {
  route: string;
  module?: AccessModule;
  level?: AccessLevel;
  disabled?: boolean;
} & React.ComponentProps<typeof TableRow>; // inherit all props

export default function RouteRow({ route, children, module, level, disabled, ...props }: Props) {
  const router = useRouter();
  const context = useUser();

  const handleClick = () => {
    if (!disabled && (module && level && hasAccess(context, module, level))) {
      router.push(route);
    }
  }

  return (
    <TableRow onClick={handleClick} {...props}>
      {children}
    </TableRow>
  );
}