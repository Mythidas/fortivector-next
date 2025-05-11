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

export interface SiteSystems {
  id: string;
  tenant_id: string;
  site_id: string;
  system_id: string;
};

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
};