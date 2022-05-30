import React, { useReducer, Suspense } from 'react';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink, LinkProps as RouterLinkProps, Outlet } from 'react-router-dom';
import { AuthTokenContext } from './hooks/auth-token';
import { DispatchContext } from './hooks/dispatch';
import reducer, { ApplicationAction, UserRecord } from './state/reducer';
import useSession from './hooks/session';
import { verify } from 'jsonwebtoken';
import { Box, CssBaseline } from '@mui/material';
import AppMenu from './components/AppMenu';

// TODO: Pull this from the api?
const API_PUBLIC_KEY = `-----BEGIN RSA PUBLIC KEY-----
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
-----END RSA PUBLIC KEY-----`;
const LinkBehavior = React.forwardRef<
    any,
    Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
    const { href, ...other } = props;
    // Map href (MUI) -> to (react-router)
    return <RouterLink ref={ref} to={href} {...other} />;
});

const theme = createTheme({
    palette: { mode: 'dark' },
    components: {
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: LinkBehavior,
            },
        },
    },
});

interface AppContextsProps {
    children?: React.ReactElement
    theme: Theme
    token?: string
    dispatch: React.Dispatch<ApplicationAction>
}

function AppContexts({ children, theme, token, dispatch }: AppContextsProps): JSX.Element {
    return (
        <ThemeProvider theme={theme}>
            <DispatchContext.Provider value={dispatch}>
                <AuthTokenContext.Provider value={token}>
                    {children}
                </AuthTokenContext.Provider>
            </DispatchContext.Provider>
        </ThemeProvider>
    );
}

function App() {
    const [session] = useSession();
    const [{ token, error }, dispatch] = useReducer(reducer, {}, () => {
        // Initialize the token from the session, ALL other code should use the AuthTokenContext
        const { token } = session;
        let user: UserRecord | undefined = undefined;
        if (token) {
            try {
                user = verify(token, API_PUBLIC_KEY) as UserRecord;
            } catch (e) {
                // The token is NOT valid, so no toke OR user
                return {};
            }
        }
        return { token, user };
    });
    return (
        <Box sx={{ display: 'flex', WebkitFontSmoothing: 'antialiased', height: '100vh', width: '100vw' }}>
            <CssBaseline />
            <AppContexts token={token} theme={theme} dispatch={dispatch}>
                <>
                    <AppMenu />
                    <Suspense>
                        <Outlet />
                    </Suspense>
                </>
            </AppContexts>
        </Box>
    );
}
/*
function App() {
    const [session] = useSession();
    const [{ token, error }, dispatch] = useReducer(reducer, {}, () => {
        // Initialize the token from the session, ALL other code should use the AuthTokenContext
        const { token } = session;
        let user: UserRecord | undefined = undefined;
        if (token) {
            try {
                user = verify(token, API_PUBLIC_KEY) as UserRecord;
            } catch (e) {
                // The token is NOT valid, so no toke OR user
                return {};
            }
        }
        return { token, user };
    });
    return (
        <ThemeProvider theme={theme}>
            <DispatchContext.Provider value={dispatch}>
                <AuthTokenContext.Provider value={token}>
                    <Layout>
                        <>
                            {token && !error &&
                                <AppRoutes />
                            }
                            {!token &&
                                <LoginScreen error={error} />
                            }
                        </>
                    </Layout>
                </AuthTokenContext.Provider>
            </DispatchContext.Provider>
        </ThemeProvider>
    );
}
*/
export default App;
