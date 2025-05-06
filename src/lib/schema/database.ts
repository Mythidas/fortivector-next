// Auto-generated interfaces from Supabase Schema

import { AccessLevel, ControlStatus, EnforcementMethod } from "@/lib/types";

export interface Roles {
  id: string;
  tenant_id?: string;
  name: string;
  description: string;
  access_rights?: {
    users: AccessLevel;
    roles: AccessLevel;
    dashboard: AccessLevel;
  };
}

export interface Systems {
  id: string;
  tenant_id?: string;
  name: string;
  description?: string;
  created_at?: Date;
  is_system_defined: boolean;
}

export interface Tenants {
  id: string;
  name: string;
  created_at?: Date;
}

export interface Users {
  id: string;
  tenant_id: string;
  role_id: string;
  email: string;
  first_name: string;
  last_name: string;
  last_sign_in?: Date;
}

export interface UserInvites {
  id: string;
  tenant_id: string;
  role_id: string;
  first_name: string;
  last_name: string;
  email: string;
  expires_at: Date;
  invite_token: string;
  created_at?: Date;
}

export interface Controls {
  id: string;
  control_code: string;
  title: string;
  status: ControlStatus;
  revision: string;
  description: string;
  system_id: string;
  tenant_id: string;
  enforcement_method: EnforcementMethod;
  enforcement_location?: string;
  playbook_id?: string;
  evidence_requirements?: {
    type: "screenshot" | "log";
    description: string;
    location_hint?: string;
  }[];
  ai_parse_rules?: any;
}

export interface ControlsToNSTSubcategories {
  id: string;
  control_id: string;
  system_id: string;
  subcategory_id: string;
}

// NST

export interface NSTCategories {
  id: string;
  function_id?: string;
  code: string;
  name: string;
  description?: string;
}

export interface NSTControlExamples {
  id: string;
  subcategory_id?: string;
  example: string;
}

export interface NSTFunctions {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface NSTSubcategories {
  id: string;
  category_id?: string;
  code: string;
  description: string;
}