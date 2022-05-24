import { useCallback, useEffect, useState } from 'react';
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
//React.Dispatch<React.SetStateAction<T | undefined>>
interface APIObject {
    id: string
    modelType: string
}

function getObjectRoot(modelType: string): string {
    switch(modelType) {
        case 'User':
            return '/users';
        default:
            return '/';
    }
}
export function useAPIObjectState<T extends APIObject>(href: string): [T | undefined, (next: T) => void] {
    const initialData = useAPIFetch<T>(href);
    const [state, setState] = useState<T | undefined>(undefined);    
    useEffect(() => {        
        if (state === undefined && isReady(initialData)) {
            setState(initialData);
        } else if (initialData instanceof Error) {
            // What to do here?
        }
    }, [initialData, state]);
    const update = useCallback((next: T) => {
        if (state && !(state instanceof Error)) {
            fetch(new URL(`${getObjectRoot(state.modelType)}/${state.id}`, apiRoot).toString(), { method: next.id ? 'PUT' : 'POST', body: JSON.stringify(next) }).then((response) => {
                response.json().then((data) => {
                    if (response.ok) {
                        setState(data);
                    } else {
                        console.log(data);
                    }
                }).catch(e => {
                    //
                    console.log(e);
                });
            }).catch(e => {
                //
                console.log(e);
            });
        };        
    }, [state]);
    return [state, update];
}