import { AccessLevel, AccessModule } from "@/lib/types";

export interface UserContextView {
  id: string;
  first_name: string;
  last_name: string;
  tenant_id: string;
  email: string;
  role_id: string;
  role_name: string;
  access_rights: Record<AccessModule, AccessLevel>
}