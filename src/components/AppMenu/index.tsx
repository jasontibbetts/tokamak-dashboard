import { Divider, Drawer as MuiDrawer, Grid, List, ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, AccountBox as AccountIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useCallback, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import useDispatch from "../../hooks/dispatch";
import useSession from "../../hooks/session";
import useAuthToken from "../../hooks/auth-token";

interface AppMenuItem {
    label: string
    icon: typeof MenuIcon
    to: string
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

export default function AppMenu({ open, items = [] }: AppMenuProps) {
    const dispatch = useDispatch();
    // convert this to useAuthUser (should have a logout function that can be called that will cleanup the session etc to make this seperation cleaner and allow logout from other areas easily without copying code)
    const token = useAuthToken();
    const [{ username, }, setSession] = useSession();
    const [drawerOpen, setDrawerOpen] = useState(open);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const handleToggleClick = useCallback(() => {
        setDrawerOpen(open => !open);
    }, [setDrawerOpen]);
    const handleLogoutClick = useCallback(() => {
        setSession((session) => ({ ...session, token: undefined, username: session.remember ? session.username : undefined }));
        dispatch({
            type: 'signout',
            data: undefined
        });
    }, [dispatch, setSession]);
    const anchorRef = useRef<Element | undefined>();
    const handleUserMenuClose = useCallback(() => {
        setUserMenuOpen(false);
    }, [setUserMenuOpen]);
    const handleAvatarClick = useCallback(() => {
        setUserMenuOpen(true);
    }, [setUserMenuOpen]);
    return (
        <Drawer variant="permanent" open={drawerOpen}>
            <Grid container direction="column" flexGrow="1" justifyContent="space-between" overflow="hidden">
                <Grid item>
                    <List component="nav">
                        <ListItemButton onClick={handleToggleClick}>
                            <ListItemIcon>
                                {drawerOpen && <ChevronLeftIcon />}
                                {!drawerOpen && <MenuIcon />}
                            </ListItemIcon>
                        </ListItemButton>
                        <Divider />
                        {items.map(({ icon: Icon, to, label }) =>
                            <ListItemButton component={Link} to={to} sx={{ color: 'color.primary' }}>
                                <ListItemIcon>
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        )}
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
                        <Menu anchorEl={anchorRef.current} open={!!userMenuOpen} MenuListProps={{ 'aria-labelledby': 'basic-button' }} onClose={handleUserMenuClose}>
                            <MenuItem disabled component={Link} to="/profile">
                                <ListItemIcon>
                                    <AccountIcon />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </MenuItem>
                            <Divider />
                            <MenuItem disabled={!token} onClick={handleLogoutClick}>
                                <ListItemIcon><LogoutIcon fontSize='small' /></ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </List>
                </Grid>
            </Grid>
        </Drawer>
    );
}