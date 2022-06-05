import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import useAuthToken from './auth-token';
import useDispatch from './dispatch';

// Put this somewhere else this is temp for now
const ApiRootContext = createContext('https://localhost:9001');

export function useAPIFetch<T>(path?: string, init?: Omit<RequestInit, 'signal'>): [T | undefined | Error, () => Promise<void>] {
    const apiRoot = useContext(ApiRootContext);
    const dispatch = useDispatch();
    const token = useAuthToken();
    const [{ uri, data }, setState] = useState<{
        data?: T | Error
        uri?: string
    }>({});
    const pending = useRef<Promise<Response> | undefined>(undefined);
    const doFetch = useCallback(async (updatedUri: string) => {
        const options = { ...init, headers: { ...init?.headers, 'Authorization': `Bearer ${token}` } };
        pending.current = fetch(updatedUri, options);
        pending.current.then(resp => {
            if (resp.ok) {
                resp.json().then(data => {
                    pending.current = undefined;
                    setState({ data, uri: updatedUri });
                }).catch(e => {
                    pending.current = undefined;
                    setState({ data: e, uri: updatedUri });
                });
            } else {
                resp.json().then(errorData => {
                    pending.current = undefined;
                    setState({ data: new Error(errorData.error.message), uri: updatedUri });
                }).catch(e => {
                    pending.current = undefined;
                    setState({ data: e, uri: updatedUri });
                });
                pending.current = undefined;
                if (resp.status === 401) {
                    dispatch({ type: 'token-expired', data: undefined });
                }
                setState({ data: new Error(resp.statusText), uri: updatedUri });
            }
        }).catch(e => {
            pending.current = undefined;
            setState({ data: e, uri: updatedUri });
        });
        setState({ uri: updatedUri, data: undefined });
        return pending.current;
    }, [token, init, dispatch]);
    const refetch = useCallback(async () => {
        setState({ uri });
        if (!uri) {
            throw new Error();
        }
        await doFetch(uri);
    }, [setState, uri, doFetch]);
    useEffect(() => {
        if (path) {
            const updatedUri = new URL(path, apiRoot).toString();
            if (uri !== updatedUri && !pending.current) {
                doFetch(updatedUri);
            }
        }
    }, [path, apiRoot, token, uri, doFetch]);
    return [data, refetch];
}

function isReady<T>(data: T | Error | undefined): data is T {
    if (data === undefined || data instanceof Error) {
        return false;
    }
    return true;
}

interface APIObject {
    id: string
    modelType: string
}

function getObjectRoot(modelType: string): string {
    switch (modelType) {
        case 'User':
            return '/users';
        default:
            return '/';
    }
}
export function useAPIObjectState<T extends APIObject>(path?: string, initialState?: T): [T | undefined | Error, (next: T) => Promise<T>] {
    const apiRoot = useContext(ApiRootContext);
    const [initialData,] = useAPIFetch<T>(path);
    const [state, setState] = useState<T | undefined | Error>(initialState);
    const token = useAuthToken();
    useEffect(() => {
        if ((state === undefined && isReady(initialData)) || (isReady(initialData) && isReady(state) && initialData.id !== state?.id)) {
            setState(initialData);
        } else if (initialData instanceof Error) {
            // What to do here?
            setState(initialData);
        }
    }, [initialData, state]);
    const update = useCallback(async (next: T) => {
        if (state && !(state instanceof Error)) {
            try {
                const response = await fetch(new URL(`${getObjectRoot(state.modelType)}/${state.id}`, apiRoot).toString(), { method: next.id ? 'PUT' : 'POST', body: JSON.stringify(next), headers: { authorization: `Bearer ${token}` } });
                if (response.ok) {
                    const data = await response.json();
                    setState(data);
                    return data;
                }
            } catch (e) {
                setState(e instanceof Error ? e : new Error(String(e)));
            }
        }
    }, [state, token, apiRoot]);
    return [state, update];
}