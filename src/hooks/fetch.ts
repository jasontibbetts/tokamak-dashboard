import { useEffect, useRef, useState } from 'react';

export class FetchError extends Error {
    status: number
    constructor(message: string, status: number, stack?: string) {
        super(message);
        this.status = status;
        this.stack = stack;
    }
}

export default function useFetch<T>(url: string, init?: Omit<RequestInit, 'signal'>, json?: boolean): T | undefined | Error {
    const ref = useRef<{ pending?: Promise<any> | undefined, url: string }>({ url });
    const [response, setResponse] = useState<T | undefined | Error>(undefined);
    useEffect(() => {
        if (!ref.current.pending && (response === undefined || ref.current.url !== url)) {
            ref.current.pending = fetch(url, init).then(resp => {
                if (resp.ok) {
                    (json ? resp.json() : resp.text()).then((data) => {
                        ref.current = { url };
                        setResponse(data);
                    }).catch(error => {
                        ref.current = { url };
                        setResponse(error);
                    });
                } else {
                    ref.current = { url };
                    setResponse(new FetchError(resp.statusText, resp.status));
                }
            }).catch(e => {
                setResponse(e);
            });
        }
    }, [url, init, response, json]);
    return response;
}