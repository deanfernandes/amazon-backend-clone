export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  is_email_verified: boolean;
}
