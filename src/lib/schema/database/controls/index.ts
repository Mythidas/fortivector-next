import { ControlStatus, EnforcementMethod, EvidenceType } from "@/lib/types";

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
  site_control_id: string;
  evidence_requirement_id?: string;
  name: string;
  description?: string;
  evidence_url: string;
  uploaded_at: string;
  uploaded_by: string;
  approved_at: string;
  approved_by: string;
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