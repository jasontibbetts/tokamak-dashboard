import { useCallback, useEffect, useRef, useState } from "react";
import { ApiObject, ApiObjectData, ApiObjectType } from "./types";
import { OBJECT_ROOTS } from './constants';
import useAPIRoot from "./root";
import useAuth from "../auth";

const STATUS_MAP: Record<number, string> = {
    404: 'Not Found',
    500: 'Unknown'
};

export class APIError extends Error {
    status: number

    constructor(message: string, status = 500) {
        super(`${status}: ${STATUS_MAP[status] || 'Unknown'} ${message}`);
        this.status = status;
    }
}

export default function useAPIObject<T extends ApiObjectData>(type: ApiObjectType, id?: string, initialData?: T): ApiObject<T> {
    const { token } = useAuth();
    const apiRoot = useAPIRoot();
    const [state, setState] = useState<{ data?: T | Error, url?: string, loading: boolean }>({ data: initialData, loading: !initialData });
    const { data, url, loading } = state;
    const pending = useRef<AbortController | undefined>();
    useEffect(() => {
        // TODO: Clean this up, it's not complete
        if (id) {
            setState({ data: undefined, url: new URL(`${OBJECT_ROOTS[type]}/${id}`, apiRoot).toString(), loading: true });
        } else {

        }
    }, [type, apiRoot, id]);
    const reload = useCallback(async () => {
        if (!url) {
            // No URL = NOOP
            return;
        }
        if (pending.current) {
            pending.current.abort();
        }
        pending.current = new AbortController();
        try {
            setState({ data: undefined, url, loading: true });
            const resp = await fetch(url, { headers: { authorization: `Bearer ${token}` }, signal: pending.current.signal });
            if (resp.ok) {
                const data = await resp.json();
                pending.current = undefined;
                setState({ data, url, loading: false });
            } else {
                throw new APIError(resp.statusText, resp.status);
            }
        } catch (e) {
            pending.current = undefined;
            setState({ data: e instanceof Error ? e : new Error(String(e)), url, loading: false });
        }
    }, [url, token]);
    const update = useCallback(async (data: T): Promise<void> => {
        if (pending.current) {
            pending.current.abort();
        }
        setState(state => ({ ...state, loading: true }));
        const url = new URL(`${OBJECT_ROOTS[type]}${id ? `/${id}` : ''}`, apiRoot).toString();
        pending.current = new AbortController();
        try {
            const resp = await fetch(url, { headers: { authorization: `Bearer ${token}` }, signal: pending.current.signal, method: id ? 'PUT' : 'POST', body: JSON.stringify(data) });
            if (resp.ok) {
                const updated = await resp.json();
                pending.current = undefined;
                setState({ data: updated, url: `${OBJECT_ROOTS[type]}/${updated.id}`, loading: false });
            } else {
                throw new Error(resp.statusText || String(resp.status));
            }
        } catch (e) {
            pending.current = undefined;
            setState({ data: e instanceof Error ? e : new Error(String(e)), url: undefined, loading: false });
        }
    }, [token, apiRoot, type, id]);
    useEffect(() => {
        if (url && !data && !pending.current) {
            reload();
        }
    }, [url, data, reload]);
    return {
        data: (data instanceof Error || (data && data.id !== id)) ? undefined : data,
        reload,
        update,
        loading: loading || (data && !(data instanceof Error) && data.id !== id),
        error: (data instanceof Error) ? data : undefined
    };
}