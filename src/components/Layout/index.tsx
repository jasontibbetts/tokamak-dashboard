import React, { Suspense, useCallback, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, CssBaseline, Divider, Drawer as MuiDrawer, Grid, LinearProgress, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, ListItemButtonProps } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApplicationsIcon from '@mui/icons-material/Apps';
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import List from '@mui/material/List';
import { Link as RouterLink } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';
import useSession from '../../hooks/session';
import useDispatch from '../../hooks/dispatch';
import AccountIcon from '@mui/icons-material/AccountBox';
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth: number = 240;

/*
interface AppBarProps extends MuiAppBarProps {    
    open?: boolean;
}
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
*/

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

export interface LayoutState {
    drawerOpen?: boolean
    userMenuOpen?: boolean
}

export interface LayoutProps extends LayoutState {
    children?: React.ReactChild
    initialState?: LayoutState
}

export default function Layout({ children, initialState = {}}: LayoutProps): JSX.Element {
    const dispatch = useDispatch();
    const [{ username }, setSession] = useSession();
    const [{ drawerOpen, userMenuOpen }, setState] = useState({ drawerOpen: false, userMenuOpen: false, ...initialState});
    const anchorRef = useRef<Element | undefined>();
    const toggleDrawer = useCallback(() => {
        setState(current => ({ ...current, drawerOpen: !current.drawerOpen}));
    }, []);
    const handleAvatarClick = useCallback((event: React.SyntheticEvent<HTMLElement>) => {
        event.preventDefault();
        setState(current => ({...current, userMenuOpen: !current.userMenuOpen }));
    }, []);
    const onUserMenuClose = useCallback(() => {
        setState(current => ({...current, userMenuOpen: !current.userMenuOpen }));
    },[]);
    const handleLogoutClick = useCallback(() => {
        setSession((session) => ({ ...session, token: undefined, username: session.remember ? session.username : undefined }));
        dispatch({
            type: 'signout',
            data: undefined
        });
    }, [setSession, dispatch]);
    return (
        <Box sx={{ display: 'flex', WebkitFontSmoothing: 'antialiased' }}>
            <CssBaseline />
            <Drawer variant="permanent" open={drawerOpen}>            
                <Grid container direction="column" flexGrow="1" justifyContent="space-between" overflow="hidden">
                    <Grid item>
                        <List component="nav">
                            <ListItemButton onClick={toggleDrawer}>
                                <ListItemIcon>
                                { drawerOpen && <ChevronLeftIcon /> }
                                { !drawerOpen && <MenuIcon /> }
                                </ListItemIcon>
                            </ListItemButton>
                            <Divider /> 
                            <ListItemButton component={RouterLink} to="/" sx={{ color: 'color.primary'}}>
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                            <ListItemButton component={RouterLink} to="/applications">
                                <ListItemIcon>
                                    <ApplicationsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Applications" />
                            </ListItemButton>
                            <ListItemButton component={RouterLink} to="/users">
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Users" />
                            </ListItemButton>                                   
                        </List>
                    </Grid> 
                    <Grid item>
                        <Divider />                        
                        <List component="nav">
                            <ListItemButton onClick={handleAvatarClick} ref={anchorRef as ListItemButtonProps['ref']} id='user-avatar'>
                                <ListItemIcon>
                                    <AccountIcon />
                                </ListItemIcon>
                                <ListItemText primary={username} />
                            </ListItemButton>
                            <Menu anchorEl={anchorRef.current} open={!!userMenuOpen} MenuListProps={{'aria-labelledby': 'basic-button'}} onClose={onUserMenuClose}>
                                <MenuItem disabled component={RouterLink} to="/profile">
                                    <ListItemIcon>
                                        <AccountIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Profile" />
                                </MenuItem>
                                <Divider/>
                                <MenuItem onClick={handleLogoutClick}>
                                    <ListItemIcon><Logout fontSize='small'/></ListItemIcon>
                                    Logout
                                </MenuItem>
                        </Menu>
                        </List>                       
                    </Grid>
                </Grid>
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
                    padding: '1rem',
                    flexFlow: 'row nowrap', 
                    alignItems: 'stretch'
                }}
            >                    
                <Suspense fallback={<LinearProgress />}>
                    {children}
                </Suspense>
            </Box>
        </Box>        
    );
}