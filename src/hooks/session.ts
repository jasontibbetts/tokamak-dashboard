import { useSyncExternalStore, createContext, useContext } from 'react';

export interface Session {
    subscribe(listener: (() => void)): (() => void)
    getState(): SessionData
    setState(next: SessionData | ((current: SessionData) => SessionData)): void
}

function readSessionKey(key: string, persistant = false): string | undefined {
    if (typeof window !== 'undefined') {
        if (persistant && window.localStorage) {
            return window.localStorage.getItem(key) || undefined;
        } else if (window.sessionStorage) {
            return window.sessionStorage.getItem(key) || undefined;
        }
    }
    return undefined;
}

function setSessionKey(key: string, value: string, persistant = false): void {
    if (typeof window !== 'undefined') {
        if (persistant && window.localStorage) {
            window.localStorage.setItem(key, value);
        } else if (window.sessionStorage) {
            window.sessionStorage.setItem(key, value);
        }
    }
}

function clearSessionkey(key: string, persistant = false): void {
    if (typeof window !== 'undefined') {
        if (persistant && window.localStorage) {
            window.localStorage.removeItem(key);
        } else if (window.sessionStorage) {
            window.sessionStorage.removeItem(key);
        }
    }
}

export function createSession(): Session {
    const token = readSessionKey('auth-token', false);
    const username = readSessionKey('username', true);
    let state: SessionData = {
        token,
        username,
        remember: username !== undefined
    };
    const listeners = new Set<(() => void)>();
    return {
        subscribe: (listener: (() => void)) => {
            listeners.add(listener);
            return () => listeners.delete(listener)
        },
        getState: () => state,
        setState: (next: SessionData | ((current: SessionData) => SessionData)) => {
            state = typeof next === 'function' ? next(state) : next;
            if (state.token) {
                setSessionKey('auth-token', state.token, false);
            } else {
                clearSessionkey('auth-token', false);
            }
            if (state.username && state.remember) {
                setSessionKey('username', state.username, true);
            } else {
                clearSessionkey('username', true);
            }
            listeners.forEach(listener => listener());
        }
    };
}

interface SessionData {
    token?: string
    username?: string
    remember?: boolean
}

export const SessionContext = createContext<Session>(createSession());

export default function useSession(): [SessionData, ((next: SessionData | ((current: SessionData) => SessionData)) => void)] {
    const session = useContext(SessionContext);
    return [
        useSyncExternalStore(session.subscribe, session.getState),
        session.setState
    ];
}