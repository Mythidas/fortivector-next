// Auto-generated interfaces from Supabase Schema

import { AccessLevel, ControlStatus, EnforcementMethod, EvidenceType } from "@/lib/types";

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
};

export interface Systems {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  created_at?: Date;
  is_system_defined: boolean;
};

export interface Tenants {
  id: string;
  name: string;
  created_at?: Date;
};

export interface Users {
  id: string;
  tenant_id: string;
  role_id: string;
  email: string;
  first_name: string;
  last_name: string;
  last_sign_in?: Date;
};

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
};

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
  ai_parse_rules?: any;
};

export interface ControlsToNSTSubcategories {
  id: string;
  control_id: string;
  system_id: string;
  subcategory_id: string;
  tenant_id: string;
};

export interface Clients {
  id: string;
  tenant_id: string;
  name: string;
};

export interface Sites {
  id: string;
  tenant_id: string;
  client_id: string;
  name: string;
};

export interface ControlEvidenceRequirements {
  id: string;
  tenant_id: string;
  control_id: string;
  requirement_type: EvidenceType;
  description: string;
  location_hint?: string;
}

export interface ControlEvidence {
  id: string;
  tenant_id: string;
  site_id: string;
  control_id: string;
  evidence_requirement_id?: string;
  name: string;
  description?: string;
  evidence_url: string;
}

export interface ControlWaiver {
  id: string;
  tenant_id: string;
  site_id: string;
  control_id: string;
  waiver_url: string;
  waiver_status: 'enforced' | 'expired';
  waiver_expiration: string; // ISO 8601 timestamp
  waiver_approver: string;   // user ID
}

export interface SiteSystems {
  id: string;
  tenant_id: string;
  site_id: string;
  system_id: string;
}

export interface SiteControls {
  id: string;
  tenant_id: string;
  site_id: string;
  site_system_id: string;
  control_id: string;
  status: 'onboarding' | 'implemented' | 'waived';
  last_validated?: string;     // ISO 8601 timestamp
  last_validated_by?: string;  // user ID
  waiver_id?: string;
}

// NST

export interface NSTCategories {
  id: string;
  function_id?: string;
  code: string;
  name: string;
  description?: string;
};

export interface NSTControlExamples {
  id: string;
  subcategory_id?: string;
  example: string;
};

export interface NSTFunctions {
  id: string;
  code: string;
  name: string;
  description?: string;
};

export interface NSTSubcategories {
  id: string;
  category_id?: string;
  code: string;
  description: string;
};