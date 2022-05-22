import { useEffect, useState } from 'react';
import useAuthToken from './auth-token';
import useDispatch from './dispatch';
import useFetch, { FetchError } from './fetch';

const apiRoot = 'https://localhost:9001';
export function useAPIFetch<T>(path: string, init?: Omit<RequestInit, 'signal'>): T | undefined | Error  {
    const dispatch = useDispatch();
    const token = useAuthToken();
    const response = useFetch<T>(new URL(path, apiRoot).toString(), {
        ...init,
        headers: {
            ...init?.headers,
            authorization: `Bearer ${token}`
        }
    }, true);
    useEffect(() => {
        if (response instanceof FetchError && response.status === 401) {
            dispatch({ type: 'token-expired', data: undefined });
        }
    }, [response, dispatch]);
    return response;
}

function isReady<T>(data: T | Error | undefined): data is T {
    if (data === undefined || data instanceof Error) {
        return false;
    }
    return true;
}

export function useAPIObjectState<T>(href: string): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>, ] {
    const initialData = useAPIFetch<T>(href);
    const [state, setState] = useState<T | undefined>(undefined);    
    useEffect(() => {        
        if (state === undefined && isReady(initialData)) {
            setState(initialData);
        } else if (initialData instanceof Error) {
            // What to do here?
        }
    }, [initialData, state]);
    return [state, setState];
}