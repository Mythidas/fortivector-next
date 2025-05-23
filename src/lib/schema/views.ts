import { AccessLevel, AccessModule, ControlStatus, EnforcementMethod, EvidenceStatus, EvidenceType } from "@/lib/types";

export interface UserContextView {
  id: string;
  first_name: string;
  last_name: string;
  tenant_id: string;
  email: string;
  role_id: string;
  role_name: string;
  access_rights: Record<AccessModule, AccessLevel>
};

export interface SiteSystemsView {
  link_id: string;
  site_id: string;
  site_name: string;
  tenant_id: string;
  system_id: string;
  system_name: string;
  system_description: string;
};

export interface SiteControlsView {
  site_control_id: string;
  site_id: string;
  control_id: string;
  status: string;
  waiver_id: string | null;
  last_validated: Date;
  last_validated_by: string;
  title: string;
  description: string;
  control_code: string;
  site_system_id: string;
  control_status: ControlStatus;
  revision: string;
  enforcement_method: EnforcementMethod;
  enforcement_location: string | null;
  review_frequency: number;
  system_name: string;
};

export interface ControlEvidenceView {
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
  email: string;
  requirement_type: EvidenceType;
  requirement_description: string;
  location_hint?: string;
  site_id: string;
  control_id: string;
  client_id: string;
  site_name: string;
  control_title: string;
  site_systems_id: string;
  system_name: string;
  status: EvidenceStatus;
  reviewer: string;
}