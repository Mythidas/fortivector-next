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