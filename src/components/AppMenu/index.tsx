import { AppBar, Divider, Drawer as MuiDrawer, Grid, IconButton, List, ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, AccountBox as AccountIcon, Logout as LogoutIcon } from '@mui/icons-material';
import React, { useCallback, useRef, useState } from "react";
import { matchRoutes, NavLink, useLocation } from 'react-router-dom';
import useAuth from "../../hooks/auth";

interface AppMenuItem {
    label: string
    icon: typeof MenuIcon
    path: string
}

interface AppMenuProps {
    open?: boolean
    items?: AppMenuItem[]
}

const drawerWidth: number = 240 as const;

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

function AppMenuListItem(item: AppMenuItem): JSX.Element {
    const { path, label, icon: Icon } = item;
    const location = useLocation();
    const selected = matchRoutes([{ path: path === '/' ? '/' : `${path.endsWith('/') ? path : `${path}/`}*` }], location.pathname) !== null;
    return (
        <ListItemButton component={NavLink} to={path} sx={{ color: 'color.primary' }} key={`${label}-${path}`} selected={selected}>
            <ListItemIcon>
                <Icon />
            </ListItemIcon>
            <ListItemText primary={label} />
        </ListItemButton>
    );
}

export default function AppMenu({ open, items = [] }: AppMenuProps) {
    const { user, signout } = useAuth();
    const [drawerOpen, setDrawerOpen] = useState(open);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const handleToggleClick = useCallback(() => {
        setDrawerOpen(open => !open);
    }, [setDrawerOpen]);
    const handleSignoutClick = useCallback((evt: React.MouseEvent) => {
        evt.preventDefault();
        setUserMenuOpen(false);
        signout();
    }, [signout]);
    const anchorRef = useRef<Element | undefined>();
    const handleUserMenuClose = useCallback(() => {
        setUserMenuOpen(false);
    }, [setUserMenuOpen]);
    const handleUserMenuClick = useCallback(() => {
        setUserMenuOpen(true);
    }, [setUserMenuOpen]);
    return (
        <Drawer variant="permanent" open={drawerOpen} sx={{ overflow: 'hidden' }}>
            <Grid container direction="column" flexGrow="1" justifyContent="space-between" overflow="hidden">
                <Grid item>
                    <AppBar position="relative">
                        <Toolbar variant="dense">
                            <IconButton onClick={handleToggleClick}>
                                {drawerOpen && <ChevronLeftIcon />}
                                {!drawerOpen && <MenuIcon />}
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <List component="nav">
                        {items.map(item => <AppMenuListItem key={`${item.path}#${item.label}`} {...item} />)}
                    </List>
                </Grid>
                {user &&
                    <Grid item>
                        <Divider />
                        <List component="nav">
                            <ListItemButton onClick={handleUserMenuClick} ref={anchorRef as ListItemButtonProps['ref']} id='user-avatar'>
                                <ListItemIcon>
                                    <AccountIcon />
                                </ListItemIcon>
                                <ListItemText primary={user.username} />
                            </ListItemButton>
                            <Menu anchorEl={anchorRef.current} open={!!userMenuOpen} MenuListProps={{ 'aria-labelledby': 'basic-button' }} onClose={handleUserMenuClose}>
                                <MenuItem disabled component={NavLink} to="/profile">
                                    <ListItemIcon>
                                        <AccountIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Profile" />
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleSignoutClick}>
                                    <ListItemIcon><LogoutIcon fontSize='small' /></ListItemIcon>
                                    Signout
                                </MenuItem>
                            </Menu>
                        </List>
                    </Grid>
                }
            </Grid>
        </Drawer>
    );
}