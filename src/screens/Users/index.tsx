import React, { Suspense, useCallback, useState } from 'react';
import { Delete } from "@mui/icons-material";
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Grid, LinearProgress, Typography, Box, AppBar, Toolbar, Dialog, DialogTitle, DialogActions, Button, DialogContent, DialogContentText } from "@mui/material";
import { Outlet, useParams, Link, useNavigate } from "react-router-dom";
import useApiObjectList from "../../hooks/api/list";
import { ApiObjectReference, UserData } from "../../hooks/api/types";
import useAuth from '../../hooks/auth';

async function performDelete(url: string, token: string): Promise<void> {
    const resp = await fetch(url, { headers: { authorization: `Bearer ${token}` }, method: 'DELETE' });
    if (!resp.ok) {
        throw new Error(resp.statusText);
    }
}

export default function Users() {
    const navigate = useNavigate()
    const { token } = useAuth();
    const { id } = useParams();
    const [users, reloadUsers] = useApiObjectList<UserData, 'username' | 'group'>('User');
    const [deleteUser, setDeleteUser] = useState<ApiObjectReference<UserData, 'username' | 'group'> | undefined>(undefined);
    const handleDeleteUserClick = useCallback((user: ApiObjectReference<UserData, 'username' | 'group'>) => {
        setDeleteUser(user);
    }, [setDeleteUser]);
    const handleConfirmCancel = useCallback(() => {
        setDeleteUser(undefined);
    }, []);
    const handleConfirmDelete = useCallback(() => {
        if (deleteUser && token) {
            const href = deleteUser.href || `https://localhost:9001/users/${deleteUser}`
            performDelete(href, token).then(() => {
                if (deleteUser.ref === id) {
                    navigate('/users');
                }
                reloadUsers();
                setDeleteUser(undefined);
            }).catch(e => {
                setDeleteUser(undefined);
            });
        }
    }, [deleteUser, token, reloadUsers, navigate, id]);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Dialog open={deleteUser !== undefined}>
                <DialogTitle>Delete User?</DialogTitle>
                <DialogContent>
                    <DialogContentText>This will delete the user: {deleteUser?.username}{'{'}{deleteUser?.ref}{'}'} This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmCancel}>Cancel</Button>
                    <Button onClick={handleConfirmDelete}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <AppBar position="relative">
                <Toolbar variant="dense">
                    <Typography variant='h6'>Users</Typography>
                </Toolbar>
            </AppBar>
            <Grid container sx={{ height: '100%' }}>
                <Grid item sx={{ overflowY: 'auto', maxHeight: '100%' }}>
                    {!users && <LinearProgress />}
                    <List>
                        {Array.isArray(users) && users.map((user: ApiObjectReference<UserData, 'username' | 'group'>) => (
                            <ListItem key={user.ref} secondaryAction={<IconButton edge="end" aria-label="delete" onClick={evt => { evt.preventDefault(); handleDeleteUserClick(user); }}><Delete /></IconButton>}>
                                <ListItemButton selected={id === user.ref} component={Link} to={user.ref}>
                                    <ListItemAvatar><Avatar>{user.group.ref.substring(0, 1).toUpperCase()}</Avatar></ListItemAvatar>
                                    <ListItemText>{user.username}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid sx={{ flexGrow: 1, height: '100%', justifyContent: 'stretch', padding: '1rem', overflowY: 'auto', overflowX: 'auto' }}>
                    <Suspense fallback={<LinearProgress />}>
                        <Outlet />
                    </Suspense>
                </Grid>
            </Grid>
        </Box>
    );
}