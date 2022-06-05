export const API_ROOT = `https://localhost:9001` as const;
export const OBJECT_TYPES = ['User', 'Application'] as const;
export const OBJECT_ROOTS: Record<typeof OBJECT_TYPES[number], string> = {
    'User': '/users',
    'Application': '/applications'
} as const;