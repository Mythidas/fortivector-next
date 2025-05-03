'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type RouteButtonProps = {
  route: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof Button>; // inherit all Button props

export default function RouteButton({ route, children, ...rest }: RouteButtonProps) {
  const router = useRouter();

  return (
    <Button onClick={() => router.push(route)} {...rest}>
      {children}
    </Button>
  );
}