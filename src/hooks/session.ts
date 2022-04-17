import { useSyncExternalStore, createContext, useContext } from 'react';

export interface Session {
    subscribe(listener: (() => void)): (() => void)
    getState(): SessionData
    setState(next: SessionData): void
}

export function createSession(): Session {
    const token = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('auth-token') || undefined : undefined;
    let state: SessionData = {
        token
    };
    const listeners = new Set<(() => void)>();
    return {
        subscribe: (listener: (() => void)) => {
            listeners.add(listener);
            return () => listeners.delete(listener)
        },
        getState: () => state,
        setState: (next: SessionData) => {
            state = next;
            if (typeof window !== 'undefined' && window.localStorage) {
                if (state.token) {
                    window.localStorage.setItem('auth-token', state.token);
                } else {
                    window.localStorage.removeItem('auth-token');
                }
            }
            listeners.forEach(listener => listener());
        }
    };
}

interface SessionData {
    token?: string
}

export const SessionContext = createContext<Session>(createSession())

export default function useSession(): SessionData {
    const session = useContext(SessionContext);
    return useSyncExternalStore(session.subscribe, session.getState);
}