// app/providers.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import UserContext, { hasAccess } from '@/lib/context/user-context';
import { createClient } from "@/utils/supabase/client";
import { UserContextView } from "@/lib/schema/views";
import { AccessModule } from "@/lib/types";
import { redirect, usePathname } from "next/navigation";

const protectedRoutes: { route: string; module: AccessModule }[] = [
  { route: "/users", module: "users" },
  { route: "/users", module: "roles" },
]

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserContextView | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data: context } = await supabase.from("user_context_view").select().eq("id", user?.id).single();
      if (context) {
        setUser(context);
        const route = protectedRoutes.find((route) => pathname!.includes(route.route));
        if (route) {
          if (!hasAccess(context, route.module, "read")) {
            redirect("/");
          }
        }
      }
    };
    getUser();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}