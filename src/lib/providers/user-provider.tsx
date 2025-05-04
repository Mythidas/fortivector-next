// app/providers.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import UserContext from '@/lib/context/user-context';
import { createClient } from "@/utils/supabase/client";
import { UserContextView } from "../schema/views";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserContextView | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data: user_context } = await supabase.from("user_context_view").select().eq("id", user?.id).single();
      if (user_context) {
        setUser(user_context);
      }
    };
    getUser();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}