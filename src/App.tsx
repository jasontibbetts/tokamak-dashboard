import { useReducer, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import AppMenu from './components/AppMenu';
import AppContexts from './components/AppContexts';
import theme from './theme';
import reducer from './state/reducer';
import useSession from './hooks/session';
import LoginScreen from './screens/Login';
import { Apps, People } from '@mui/icons-material';
import { decryptUserToken } from './hooks/auth';

export default function App() {
    const [{ token: sessionToken }] = useSession();
    const sessionUser = sessionToken ? decryptUserToken(sessionToken) : undefined;
    const [state, dispatch] = useReducer(reducer, { token: sessionToken && sessionUser ? sessionToken : undefined, user: sessionUser });
    const { token, user } = state;
    const menuItems = user ? [{ label: 'Applications', to: '/applications', icon: Apps }, { label: 'Users', to: '/users', icon: People }] : [];
    return (
        <Box sx={{ display: 'flex', WebkitFontSmoothing: 'antialiased', height: '100vh', width: '100vw' }} component="main">
            <CssBaseline />
            <AppContexts token={token} theme={theme} dispatch={dispatch} user={user}>
                <>
                    <AppMenu items={menuItems} />
                    <Suspense>
                        {!user && <LoginScreen />}
                        {user && <Outlet />}
                    </Suspense>
                </>
            </AppContexts>
        </Box>
    );
};
