export type UserRole = 'creator' | 'admin' | 'member';

export const UserRoleEnum = {
  CREATOR: 'creator' as UserRole,
  ADMIN: 'admin' as UserRole,
  USER: 'member' as UserRole
}; 