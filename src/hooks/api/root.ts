import { createContext, useContext } from "react";

export const ApiRootContext = createContext('https://localhost:9001');

export default function useAPIRoot(): string {
    return useContext(ApiRootContext);
}