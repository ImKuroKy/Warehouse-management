import { UserRole } from './user-role.model';

export interface Organization {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
}

export interface OrganizationUser {
  id: string;
  organizationId: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
} 
 