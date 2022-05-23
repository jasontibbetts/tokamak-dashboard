import { Alert, Button, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Select, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAPIFetch } from "../../hooks/api";
type UserReference = {
    rel: 'User'
    ref: string
    href: string
    username: string
}
type GroupReference = {
    rel: 'Group',
    ref: string
    //href: string
}
type UserRecord = {
    id: string
    modelType: 'User'
    username: string
    group: GroupReference
    createdAt: number
    updatedAt?: number
    createdBy: Omit<UserReference, 'username'>
    updatedBy?: Omit<UserReference, 'username'>
    password?: string
}

type FormState = {
    loading?: boolean
    error?: Error
    data?: UserRecord
    pristine?: boolean
}

function resourceIsReady<T>(data: T | Error | undefined): data is T {
    return !(data === undefined || data instanceof Error);
}

export default function UserDetails() {
    const { id } = useParams();
    const user = useAPIFetch<UserRecord>(`/users/${id}`);
       
    const groups = useAPIFetch<GroupReference[]>(`/groups`);
    const [state, setState] = useState<FormState>({ loading: true, pristine: true });
    const handleChange = useCallback((event: any): void => {
        const { value, name } = event.target;
        switch (name) {
            case 'group':
                setState(state => state.data ? ({...state, data: {...state.data, group: { rel: 'Group', ref: value } }, pristine: false}) : state);
                break;
            default:
                setState(state => state.data ? ({...state, data: {...state.data, [name]: value }, pristine: false }) : state);
                break;
        }
        console.log(`${name}=${value}`);
    }, []);
    const handleCancel = useCallback(() => {
        if (user && !(user instanceof Error)) {
            setState(state => ({...state, data: user, pristine: true }));
        }
    }, [user]);
    useEffect(() => {
        if (resourceIsReady(user) && resourceIsReady(groups)) {
            setState({ data: user, pristine: true, loading: false });
        } else if (user instanceof Error) {
            setState(prev => ({...prev, error: user }))
        } else if (groups instanceof Error) {
            setState(prev => ({...prev, error: groups }))
        }
    }, [user, groups]);
    const handleSubmit = useCallback((evt: React.SyntheticEvent<HTMLFormElement>) => {
        evt.preventDefault();
        console.log('submit() => ', state);
    }, [state]); 
    if (user instanceof Error) {
        return <Alert color="error">{user.message}</Alert>
    }
    if (groups instanceof Error) {
        return <Alert color="error">{groups.message}</Alert>
    }
    /*
    if (user === undefined || groups === undefined || state.data === undefined) {
        return <LinearProgress />
    }
    */
    console.log('render() => ', state);
    return (
        <form onSubmit={handleSubmit}>
            <Grid container gap={2} alignItems="center">
                <Grid item>
                    <TextField label="Username" name="username" value={state.data?.username || '...'} onChange={handleChange} disabled={!state.data || state.loading}/>
                </Grid>
                <Grid item>
                    <TextField label="Password" name="password" value={state.data?.password || ''} onChange={handleChange} disabled={!state.data || state.loading}/>
                </Grid>
                <Grid item>
                    <FormControl>
                        <InputLabel>Group</InputLabel>
                        <Select name="group" label="Group" value={state.data?.group.ref || '...'} onChange={handleChange} disabled={!state.data || state.loading}>
                            {groups?.map(({ ref }: { ref: string }) => (<MenuItem value={ref} key={ref}>{ref}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Button type="submit" variant="contained" disabled={!state.data || state.loading}>Save</Button>
                    <Button variant="text" disabled={!state.data || state.loading || state.pristine} onClick={handleCancel}>Cancel</Button>
                </Grid>
            </Grid>
        </form>
    );
}