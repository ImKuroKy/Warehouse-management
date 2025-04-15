import { UserRole } from './user-role.model';

export interface OrganizationUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
} 
 