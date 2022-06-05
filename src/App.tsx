import { useReducer, Suspense, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, LinearProgress } from '@mui/material';
import AppMenu from './components/AppMenu';
import AppContexts from './components/AppContexts';
import theme from './theme';
import reducer, { ApplicationState } from './state/reducer';
import useSession, { SessionData } from './hooks/session';
import LoginScreen from './screens/Login';
import { Apps, Dashboard, People } from '@mui/icons-material';
import { decryptUserToken } from './hooks/auth';

function initializeStateFromSession(session: SessionData): ApplicationState {
    const { token } = session;
    const user = token ? decryptUserToken(token) : undefined;
    return {
        token: user && token ? token : undefined,
        user
    };
}

export default function App() {
    const [session, setSession] = useSession();
    const [state, dispatch] = useReducer(reducer, initializeStateFromSession(session));
    const { token, user } = state;
    const menuItems = user ? [
        { label: 'Dashboard', path: '/', icon: Dashboard },
        { label: 'Applications', path: '/applications', icon: Apps },
        { label: 'Users', path: '/users', icon: People }
    ] : [];
    const signout = useCallback(() => {
        setSession(session => ({ ...session, token: undefined, username: session.remember ? session.username : undefined }));
        dispatch({
            type: 'signout',
            data: undefined
        });
    }, [dispatch, setSession]);
    return (
        <Box sx={{ display: 'flex', WebkitFontSmoothing: 'antialiased', height: '100vh', width: '100vw', overflow: 'hidden' }} component="main">
            <CssBaseline />
            <AppContexts token={token} theme={theme} dispatch={dispatch} user={user} signout={signout}>
                <>
                    {user &&
                        <>
                            <AppMenu items={menuItems} />
                            <Suspense fallback={<LinearProgress />}>
                                <Outlet />
                            </Suspense>
                        </>
                    }
                    {!user && <LoginScreen />}
                </>
            </AppContexts>
        </Box>
    );
};
