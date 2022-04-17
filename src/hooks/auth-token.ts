import { createContext, useContext } from 'react';

export const AuthTokenContext = createContext<string | undefined>(undefined);

export default function useAuthToken(): string | undefined {
    return useContext(AuthTokenContext);
}