import { createContext, useContext } from 'react';

export interface AuthUser {
    id: string
    username: string
    group: any
}

export const AuthUserContext = createContext<AuthUser | undefined>(undefined);

export default function useAuthUser(): AuthUser | undefined {
    return useContext(AuthUserContext);
}