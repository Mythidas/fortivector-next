export interface Systems {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  created_at?: Date;
  is_system_defined: boolean;
};