import { AccessLevel, AccessModule } from "@/lib/types";

export interface Roles {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  access_rights?: Record<AccessModule, AccessLevel>;
};