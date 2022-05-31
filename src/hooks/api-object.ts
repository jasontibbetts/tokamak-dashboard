import { useCallback, useEffect, useState, useRef } from "react";


export type BaseRESTObjectData = Record<string, unknown>;

export interface RESTObjectState<T extends BaseRESTObjectData> {
    data?: T
    loading?: boolean
    error?: Error
}

export interface RESTObject<T extends BaseRESTObjectData> extends RESTObjectState<T> {
    reload(): Promise<T | undefined>
    update(updatedData: T): Promise<T>
}

export interface RESTObjectConfig<T extends BaseRESTObjectData> {
    id?: string
    initialData?: T
    token: string
    root: string
}

export default function useApiObject<T extends BaseRESTObjectData>({ id, initialData, token, root }: RESTObjectConfig<T>): RESTObject<T> {
    const [data, setData] = useState<T | undefined | Error>(initialData);
    const pending = useRef<{ request?: Promise<Response>, controller?: AbortController }>({});
    const reload = useCallback(async (): Promise<T | undefined> => {
        // return the pending load
        if (pending.current.request) {
            return (await (pending.current.request)).json();
        }
        if (!id) {
            return initialData;
        }
        try {
            pending.current.controller = new AbortController();
            const response = await (pending.current.request = fetch(`${root}/${id}`, { method: 'GET', headers: { authorization: `Bearer ${token}` }, signal: pending.current.controller.signal }));
            if (!response.ok) {
                if (response.headers.get('content-type') === 'application/json') {
                    throw new Error((await response.json()).error?.message || 'unknown error');
                }
                throw new Error(response.statusText || 'unknown error');
            }
            const data = (await response.json()) as T;
            pending.current = {};
            setData(data);
            return data;
        } catch (e) {
            pending.current = {};
            if ((e as any).name !== 'AbortError') {
                setData(e instanceof Error ? e : new Error(String(e)));
            }
            return undefined;
        }
    }, [root, id, token, initialData]);
    const update = useCallback(async (updateData: T) => {
        if (pending.current.controller) {
            pending.current.controller.abort();
        }
        return updateData;
    }, []);
    useEffect(() => {
        if (data === undefined) {
            reload();
        }
        return () => {
            if (pending.current.controller) {
                pending.current.controller.abort();
            }
        };
    }, [data, reload]);
    return {
        data: data instanceof Error ? undefined : data,
        error: data instanceof Error ? data : undefined,
        loading: data === undefined,
        reload,
        update
    };
}