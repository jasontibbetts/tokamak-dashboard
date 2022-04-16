import { createContext, useContext } from 'react';

export const AuthTokenContext = createContext<any | undefined>(undefined);

export default function useAuthToken(): any | undefined {
    return useContext(AuthTokenContext);
}