import React, { Suspense, useCallback, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Avatar, Box, CssBaseline, Divider, Drawer as MuiDrawer, IconButton, LinearProgress, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApplicationsIcon from '@mui/icons-material/Apps';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import List from '@mui/material/List';
import { Link as RouterLink } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';
import useSession from '../../hooks/session';
import useDispatch from '../../hooks/dispatch';
import { AppTitleRoutes } from '../AppRoutes';
import PersonIcon from '@mui/icons-material/Person';

const drawerWidth: number = 240;
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

export default function Layout({ children }: { children?: React.ReactChild }): JSX.Element {
    const dispatch = useDispatch();
    const [{ username }, setSession] = useSession();
    const [{ drawerOpen, userMenuOpen }, setState] = useState({ drawerOpen: false, userMenuOpen: false });
    const anchorRef = useRef<any>();
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
            <AppBar position="absolute" open={drawerOpen}>
                <Toolbar
                    sx={{
                        pr: '24px', // keep right padding when drawer is closed
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
                        <AppTitleRoutes/>
                    </Typography>                        
                    <IconButton onClick={handleAvatarClick} ref={anchorRef} id='user-avatar'>
                        <Avatar variant="square"/>
                    </IconButton>                        
                    <Menu anchorEl={anchorRef.current} open={userMenuOpen} MenuListProps={{'aria-labelledby': 'basic-button'}} onClose={onUserMenuClose}>
                        <MenuItem disabled={true}>
                            <ListItemIcon>
                                <Avatar variant="square" sx={{ width: 24, height: 24 }}/>
                            </ListItemIcon>
                            {username}
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={handleLogoutClick}>
                            <ListItemIcon><Logout fontSize='small'/></ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
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
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItemButton>
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
                    padding: '1rem',
                    flexFlow: 'row nowrap', 
                    alignItems: 'stretch'
                }}
            >                    
                <Suspense fallback={<LinearProgress />}>
                    <Toolbar />
                    {children}
                </Suspense>
            </Box>
        </Box>        
    );
}