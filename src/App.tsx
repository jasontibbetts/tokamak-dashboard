import React, { Suspense, useReducer } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { AuthTokenContext } from './hooks/auth-token';
import { DispatchContext } from './hooks/dispatch';
import reducer from './state/reducer';
import useSession from './hooks/session';
import Layout from './components/Layout';
import AppRoutes from './components/AppRoutes';

const LinkBehavior = React.forwardRef<
  any,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

const LoginScreen = React.lazy(() => import('./screens/Login'));

function App() {
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
    const [session] = useSession();
    const [{ token, error }, dispatch] = useReducer(reducer, {}, () => {
        // Initialize the token & username from the session most other code should use this (login ui is exception)
        const { token, username } = session;
        return { token, username };
    });
    return (
        <DispatchContext.Provider value={dispatch}>
        <AuthTokenContext.Provider value={token}>
        <ThemeProvider theme={theme}>
            <Suspense>
            {token && 
                <Layout>
                    <AppRoutes />
                </Layout>
            }
            {!token && 
                <LoginScreen error={error} />
            }         
            </Suspense>   
        </ThemeProvider>            
        </AuthTokenContext.Provider>
        </DispatchContext.Provider>
      );
}

export default App;
