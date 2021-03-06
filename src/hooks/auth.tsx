import { verify } from 'jsonwebtoken';
import { createContext, useContext } from 'react';

export type UserReference = {
    rel: 'User'
    ref: string
    username?: string
}

export type GroupReference = {
    rel: 'Group'
    ref: string
}


export interface UserRecord {
    id: string
    modelType: 'User'
    createdAt: number
    createdBy: UserReference
    updatedAt?: number
    updatedBy?: UserReference
    group: GroupReference
    username: string
}

export interface Auth {
    user?: UserRecord
    token?: string
    signout(): void
}

export const API_PUBLIC_KEY = `-----BEGIN RSA PUBLIC KEY-----
MIICCgKCAgEAxzE7yCb6JqFkg5FAnHB4eBv37I9g5MHHkdhRf8p9nDpEO+us6O67
aDtFFD/WyG5+JZ+D8+urTYk+rKdu66kvIRJinP90InxCVUr9n5lKBtNQ04yAeklE
kJU4PnAVoL16eXTtlZiBWsVJraLgDoQaDhaxMKekgHDcymfNLEdVvmnRhyq3NO99
p5fVm6uVo20/TjvKVYsjccSG3RverYbCNvcDkausggLUJDzfTV4+WG+7DIMjPIU5
wyvd4/9IN9VrfPqv2GGhq0SfuB+0CjCs0PDvHIPCEcq8Py6BSiFfmiuzaIhSPsf5
InI2WHWlM4aRFc4GGx7EILG/Dfd1Qn8XNXlX+QyR6skTx45c3YCvZAV5vWlN6qyv
UHAhmNDbHrh0tuuPaYvz6KKBAA8tfOb9DTUH7JNkWkm8kbRi/0c7Po/s1ECiI4yO
plFO0IcqqiXEWo73X9h27KCKMFS0nN5hT3RMl290giQirrhtxQmmRdUMSN/b+kS0
TwNpSX//pjEE5e5idYLUagvHYso3r5MhU44brvFootHWYvceQ/xSNJ71tFu29sEe
/oq1hEcAo0pVvcnvMxFpN36HQ5H3Y1JbT/6/Wkp2XqG4CXfVhBBH9zkN5Oh6rZao
QxA6L4Ctrchdl7zQJWNBmO8ByVdd3/+PhjnNE11wgbZPnptYSVt+4+0CAwEAAQ==
-----END RSA PUBLIC KEY-----` as const;

export const AuthContext = createContext<Auth>({ signout: () => { } });
export function decryptUserToken(token: string): UserRecord | undefined {
    try {
        return (verify(token, API_PUBLIC_KEY) as { user: UserRecord }).user;
    } catch (e) {
        return undefined;
    }
}
export default function useAuth(): Auth {
    return useContext(AuthContext);
}