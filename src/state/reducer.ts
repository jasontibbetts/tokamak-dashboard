
export interface SigninAction {
    type: 'signin'
    data: string
}

export interface ToggleDrawerAction {
    type: 'toggle-drawer'
    data?: boolean
}

export interface SignoutAction {
    type: 'signout'
    data: undefined
}

export type ApplicationAction = SigninAction | SignoutAction | ToggleDrawerAction;

export interface ApplicationState {
    token?: any
    drawerOpen?: boolean
}

export default function reducer(state: ApplicationState, action: ApplicationAction): ApplicationState {
    const { type } = action;
    console.log(`App::reducer()`, action);
    switch(type) {
        case 'toggle-drawer': {
            const { data } = action;
            return {
                ...state,
                drawerOpen: data === undefined ? !state.drawerOpen : data
            };
        }
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
        default: return state;
    }
}