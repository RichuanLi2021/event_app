export const USER_ROLES  = ['USER', 'ORGANIZER'] as const;
export const PUBLIC_ROLE = ['USER'] as const;
export const ORGANIZER_ROLE = ['ORGANIZER'] as const;
export const ADMIN_ROLE = ['ADMIN'] as const;
export type Role = typeof USER_ROLES[number] | typeof ADMIN_ROLE[number];