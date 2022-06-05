import { useCallback, useEffect, useState, useRef } from "react";
import useAuth from "../auth";
import { OBJECT_ROOTS } from "./constants";
import useAPIRoot from "./root";
import { ApiObjectData, ApiObjectReference } from "./types";

export default function useApiObjectList<T extends ApiObjectData, P extends keyof T>(type: T['modelType']): [ApiObjectReference<T, P>[] | undefined, () => Promise<void>] {
    const { token } = useAuth();
    const apiRoot = useAPIRoot();
    const [{ data, url }, setState] = useState<{ data?: ApiObjectReference<T, P>[] | Error, url?: string }>({});
    const pending = useRef<AbortController | undefined>();
    useEffect(() => {
        setState(state => ({ ...state, url: new URL(`${OBJECT_ROOTS[type]}`, apiRoot).toString() }));
    }, [type, apiRoot]);
    const reload = useCallback(async () => {
        if (!url) {
            // what to do about this case
            return;
        }
        if (pending.current) {
            pending.current.abort();
        }
        pending.current = new AbortController();
        try {
            const resp = await fetch(url, { headers: { authorization: `Bearer ${token}` }, signal: pending.current.signal });
            if (resp.ok) {
                const data = await resp.json();
                setState({ data, url });
            } else {
                setState({ data: new Error(), url });
            }
        } catch (e) {
            setState({ data: new Error(), url });
        }
    }, [url, token]);
    useEffect(() => {
        if (data === undefined && !pending.current) {
            reload();
        }
    }, [data, reload]);
    return [data instanceof Error ? [] : data, reload];
}