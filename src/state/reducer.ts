
export interface SigninAction {
    type: 'signin'
    data: string
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

type UserReference = {
    rel: 'User'
    ref: string
    href: string
    username: string
}
type GroupReference = {
    rel: 'Group',
    ref: string
    //href: string
}

export type UserRecord = {
    id: string
    modelType: 'User'
    username: string
    group: GroupReference
    createdAt: number
    updatedAt?: number
    createdBy: Omit<UserReference, 'username'>
    updatedBy?: Omit<UserReference, 'username'>
}

export type ApplicationAction = SigninAction | SignoutAction | TokenExpired | CreateApplication;

export interface ApplicationState {
    token?: string
    error?: Error
    user?: UserRecord
}

export default function reducer(state: ApplicationState, action: ApplicationAction): ApplicationState {
    const { type } = action;
    switch(type) {
        case 'signin': {
            const { data } = action;
            return {
                ...state,
                token: data
            }
        };
        case 'signout': return {
            ...state,
            token: undefined
        };
        case 'token-expired': return {
            ...state,
            token: undefined,
            error: new Error('Session Expired')
        };
        default: return state;
    }
}