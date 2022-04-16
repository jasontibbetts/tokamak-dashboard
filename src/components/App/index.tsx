import React, { Suspense, useCallback, useReducer } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Routes, Route } from "react-router-dom";
import { Box, CssBaseline, Divider, Drawer as MuiDrawer, IconButton, LinearProgress, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApplicationsIcon from '@mui/icons-material/Apps';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import List from '@mui/material/List';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { AuthTokenContext } from '../../hooks/auth-token';
import { DispatchContext } from '../../hooks/dispatch';
import reducer from '../../state/reducer';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const LinkBehavior = React.forwardRef<
  any,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
);

const DashboardScreen = React.lazy(() => import('../../screens/Dashboard'));
const ApplicationsScreen = React.lazy(() => import('../../screens/Applications'));
const SigninScreen = React.lazy(() => import('../../screens/Signin'));

function App() {
    const theme = createTheme({
        components: {
            MuiButtonBase: {
                defaultProps: {
                    LinkComponent: LinkBehavior,
                },
            },
        },
    });
    const [{ drawerOpen, token }, dispatch] = useReducer(reducer, undefined, () => {
        const token = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('auth-token') || undefined : undefined;
        return { token, drawerOpen: false };
    });
    const toggleDrawer = useCallback(() => {
        dispatch({ type: 'toggle-drawer' });
    }, []);
    if (token === undefined) {
        return (
            <DispatchContext.Provider value={dispatch}>
            <ThemeProvider theme={theme}>
                <Box sx={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex'
                }}>
                    <Suspense fallback={<LinearProgress/>}>
                        <SigninScreen />
                    </Suspense>                    
                </Box>
            </ThemeProvider>
            </DispatchContext.Provider>
        );
    }
    console.log(`App::render()`, { drawerOpen, token });
    return (
        <DispatchContext.Provider value={dispatch}>
        <AuthTokenContext.Provider value={undefined}>
            <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={drawerOpen}>
                <Toolbar
                    sx={{
                    pr: '24px', // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                        marginRight: '36px',
                        ...(drawerOpen && { display: 'none' }),
                    }}
                    >
                    <MenuIcon />
                    </IconButton>
                    <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                    >
                    <Routes>
                        <Route path="/" element={'Dashboard'} />
                        <Route path="/applications" element={'Applications'} />
                    </Routes>
                    </Typography>
                </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={drawerOpen}>
                <Toolbar
                    sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <ListItem component={RouterLink} to="/">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem component={RouterLink} to="/applications">
                        <ListItemIcon>
                            <ApplicationsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Applications" />
                    </ListItem>
                    <Divider sx={{ my: 1 }} />                
                </List>
                </Drawer>
                <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
                >
                    <Toolbar />
                    <Suspense fallback={<LinearProgress />}>
                        <Routes>
                            <Route path="/" element={<DashboardScreen />}/>
                            <Route path="/applications" element={<ApplicationsScreen />}/>
                        </Routes>
                    </Suspense>
                </Box>
            </Box>
            </ThemeProvider>            
        </AuthTokenContext.Provider>
        </DispatchContext.Provider>
      );
}

export default App;
