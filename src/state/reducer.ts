import { UserRecord } from "../hooks/auth"

export interface SigninAction {
    type: 'signin'
    data: {
        token: string
        user: UserRecord
    }
}

export interface SignoutAction {
    type: 'signout'
    data: undefined
}

export interface TokenExpired {
    type: 'token-expired'
    data: undefined
}

export interface CreateApplication {
    type: 'create-application'
    data: undefined
}

export type ApplicationAction = SigninAction | SignoutAction | TokenExpired | CreateApplication;

export interface ApplicationState {
    token?: string
    user?: UserRecord
    error?: Error
}

export default function reducer(state: ApplicationState, action: ApplicationAction): ApplicationState {
    const { type } = action;
    console.debug(`AppReducer::${type}`, action.data);
    switch (type) {
        case 'signin': {
            const { data: { token, user } } = action;
            return {
                ...state,
                token,
                user
            }
        };
        case 'signout': return {
            ...state,
            token: undefined,
            user: undefined
        };
        case 'token-expired': return {
            ...state,
            token: undefined,
            user: undefined,
            error: new Error('Session Expired')
        };
        default: return state;
    }
}