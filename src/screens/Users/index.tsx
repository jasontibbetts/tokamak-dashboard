import { Alert, Avatar, Card, CardActions, CardHeader, Fab, FormControl, Grid, IconButton, InputLabel, LinearProgress, Link, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useAPIFetch } from "../../hooks/api";
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/system";
import useAuthToken from "../../hooks/auth-token";

type UserReference = {
    rel: 'User'
    ref: string
    href: string
    username: string
    group: {
        ref: string
    }
    deleting?: boolean
}

type GroupReference = {
    rel: 'Group'
    ref: string
    href: string
    name: string
}

function includeUser(user: UserReference, username: string, group: string): boolean {
    return (username !== '' ? user.username.match(username) !== null : true) && (group !== '*' ? user.group.ref === group : true);
}

export default function UsersScreen(): JSX.Element {
    const token = useAuthToken();
    const [users, reloadUsers] = useAPIFetch<UserReference[]>('/users');
    const [groups, reloadGroups] = useAPIFetch<GroupReference[]>('/groups');
    const [{ username, group }, setSearch] = useState<{ username: string, group: string }>({ username: '', group: '*' });
    const [results, setResults] = useState<UserReference[]>([]);
    const handleSearchSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
    }, []);
    const handleSearchChange = useCallback((event: any) => {
        setSearch((current) => ({ ...current, [event.target.name]: event.target.value }));
    }, []);
    const refresh = useCallback(async () => {
        setResults([]);
        await Promise.all([reloadUsers(), reloadGroups()]);
    }, [reloadUsers, reloadGroups]);
    const handleDeleteUserClickFactory = useCallback((id: string): React.MouseEventHandler => {
        return (event: React.MouseEvent): void => {
            if (Array.isArray(users)) {
                console.log(event, id);
                const user = users.find(({ ref }) => ref === id);
                if (user) {
                    // Flag the user as being deleted
                    setResults(results => results.map(user => user.ref === id ? { ...user, deleting: true } : user));
                    // delete the user
                    fetch(user.href, { method: 'DELETE', headers: { authorization: `Bearer ${token}` } }).then(resp => {
                        if (!resp.ok) {
                            console.log(resp.statusText);
                        }
                        reloadUsers();
                    }).catch(e => {
                        // what to do here?
                        reloadUsers();
                    });
                } else {
                    console.log(`the actual fuck...`);
                }
            }
        };
    }, [users, reloadUsers, token]);
    useEffect(() => {
        if (users && Array.isArray(users)) {
            setResults(users.filter(user => includeUser(user, username, group)));
        }
    }, [users, username, group]);
    return (
        <>
            <Box padding="1rem">
                <Typography variant="h6">Users</Typography>
                <Paper variant="elevation" elevation={24} sx={{ padding: '1rem', margin: '1rem 0' }}>
                    {groups instanceof Error && <Alert severity="error">Error loading user groups</Alert>}
                    <form onSubmit={handleSearchSubmit} noValidate>
                        <FormControl>
                            <TextField label="Username" name="username" id="username" placeholder="search by Username" value={username} onChange={handleSearchChange} />
                        </FormControl>
                        <FormControl>
                            <InputLabel>Group</InputLabel>
                            <Select name="group" label="Group" value={group} onChange={handleSearchChange} placeholder="search by Group" disabled={groups === undefined}>
                                <MenuItem value="*"><em>any</em></MenuItem>
                                {groups !== undefined && !(groups instanceof Error) &&
                                    groups?.map(({ ref }: { ref: string }) => (<MenuItem value={ref} key={ref}>{ref}</MenuItem>))
                                }
                            </Select>
                        </FormControl>
                        <IconButton type="submit" onClick={refresh}><RefreshIcon /></IconButton>
                    </form>
                </Paper>
                {users === undefined && <LinearProgress />}
                {users instanceof Error && <Alert severity="error">Error loading users</Alert>}
                <Grid container spacing={4} marginTop={'1rem'}>
                    {results.map(({ username, ref, group, deleting }) => <Grid item key={ref}>
                        <Card sx={{ padding: '1rem' }}>
                            <CardHeader avatar={<Avatar sx={{ bgcolor: group.ref === 'admin' ? 'primary.main' : 'secondary.main' }}>{group.ref.substring(0, 1).toUpperCase()}</Avatar>} title={<Link component={RouterLink} to={`/users/${ref}`}>{username}</Link>} subheader={ref} />
                            <CardActions>
                                <IconButton component={RouterLink} to={`/users/${ref}`} disabled={deleting}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={handleDeleteUserClickFactory(ref)} disabled={deleting}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>)}
                </Grid>
            </Box>
            <Fab color="primary" component={RouterLink} to={'/users/create'}>
                <AddIcon arial-label={'create user'} />
            </Fab>
        </>
    );
}