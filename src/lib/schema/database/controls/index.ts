import { ControlStatus, EnforcementMethod, EvidenceStatus, EvidenceType, WaiverStatus } from "@/lib/types";

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
  review_frequency: number;
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
  reviewed_at: string;
  reviewed_by: string;
  status: EvidenceStatus;
}

export interface ControlWaivers {
  id: string;
  tenant_id: string;
  site_id: string;
  site_control_id: string;
  url: string;
  status: WaiverStatus;
  expiration: string; // ISO 8601 timestamp
  reason: string;
  updated_by?: string;   // user ID
  updated_at?: string;
  created_by: string;
  created_at: string;
}

export interface ControlWaiversView {
  id: string;
  tenant_id: string;
  site_id: string;
  site_control_id: string;
  url: string;
  status: WaiverStatus;
  expiration: string; // ISO 8601 timestamp
  reason: string;
  updated_by?: string;   // user ID
  updated_at?: string;
  created_by: string;
  created_at: string;
  creator: string;
  updater: string;
}