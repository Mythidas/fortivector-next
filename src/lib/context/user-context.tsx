// lib/context/UserContext.tsx
'use client';

import { createContext, useContext } from 'react';
import { UserContextView } from "@/lib/schema/views";
import { AccessLevel, AccessModule } from "@/lib/types";

const UserContext = createContext<UserContextView | null>(null);

export const useUser = () => useContext(UserContext);

export default UserContext;

export function hasAccess(context: UserContextView | null, module: AccessModule, access: AccessLevel) {
  if (!context) return false;
  const value = context.access_rights[module];

  if (value === "none") return false;
  else if (access === "read") {
    return value === "read" || value === "edit" || value === "full";
  } else if (access === "edit") {
    return value === "edit" || value === "full";
  }

  return value === "full";
}