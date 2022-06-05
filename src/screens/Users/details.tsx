import { Button, Paper, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Select, TextField, Typography, SelectChangeEvent, Box, Link, Alert, Skeleton } from "@mui/material";
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useAPIObject, { APIError } from "../../hooks/api";
import { GroupReference, UserData } from "../../hooks/api/types";
import { Link as RouterLink } from 'react-router-dom';

const GROUP_LABEL_ID = 'user-details-group' as const;

function formatDate(date: number | Date): string {
    return new Date(date).toLocaleString();
}

function ErrorDisplay({ error, type }: { error: Error, type: string }): JSX.Element {
    return (
        <Alert severity="error">
            {(error instanceof APIError ? error.message : error.message).replace(/^\d*:\s(.*)$/, `${type} $1`)}
        </Alert>
    );
}

export default function UserDetails() {
    const { id } = useParams();
    const { data, update, loading, error } = useAPIObject<UserData>('User', id);
    const [state, setState] = useState<{ data?: UserData, pristine?: boolean }>({ data });
    const handleFormSubmit = useCallback((evt: FormEvent) => {
        evt.preventDefault();
        if (state.data) {
            update(state.data);
        }
    }, [update, state.data]);
    useEffect(() => {
        if (data?.id === id) {
            setState((state) => ({ ...state, data, pristine: true }));
        } else {
            setState((state) => ({ ...state, data: undefined }));
        }
    }, [data, id]);
    // todo get from a context
    const groups: GroupReference[] = useMemo(() => [{ ref: 'user', rel: 'Group' }, { ref: 'admin', rel: 'Group' }], []);
    const handleInputChange = useCallback((evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { value, name } = evt.target;
        switch (name) {
            case 'group':
                const group = groups.find(({ ref }) => ref === value);
                if (group) {
                    setState((current) => ({ ...current, data: current.data ? { ...current.data, [name]: group } : current.data, pristine: false }));
                }
                break;
            default:
                setState((current) => ({ ...current, data: current.data ? { ...current.data, [name]: value } : current.data, pristine: false }));
                break;
        }
    }, [groups]);
    return (
        <>
            {error && <ErrorDisplay error={error} type="User" />}
            {!error && data &&
                <Paper sx={{ padding: '1rem', margin: '0.5rem', display: 'flex' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <form onSubmit={handleFormSubmit} noValidate>
                            <Grid container sx={{ flexFlow: 'column' }} gap={2}>
                                <Grid item>
                                    <FormControl fullWidth>
                                        <TextField name="username" label="Username" value={loading ? '' : state.data?.username || ''} variant="outlined" disabled={loading || error !== undefined} onChange={handleInputChange} />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth>
                                        <TextField name="password" label="Password" value={loading ? '' : state.data?.password || ''} variant="outlined" disabled={loading || error !== undefined} type="password" onChange={handleInputChange} autoComplete='off' />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth>
                                        <InputLabel id={GROUP_LABEL_ID} variant="outlined">Group</InputLabel>
                                        <Select name="group" label="Group" value={loading ? '' : state.data?.group.ref || ''} disabled={loading || error !== undefined} variant="outlined" labelId={GROUP_LABEL_ID} onChange={handleInputChange}>
                                            {groups.map(({ ref }: { ref: string }) => (<MenuItem value={ref} key={ref}>{ref}</MenuItem>))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    {loading && <LinearProgress />}
                                    <Button type="submit" disabled={loading || state.pristine || error !== undefined}>save</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                    <Box sx={{ flexGrow: 0, padding: '0.5rem' }}>
                        <Typography>ID: {id}</Typography>
                        {data?.createdAt &&
                            <Typography>created at {formatDate(data.createdAt)} by {data.createdBy?.ref && <Link component={RouterLink} to={`/users/${data.createdBy.ref}`}>{data.createdBy.username || data.createdBy.ref}</Link>}</Typography>
                        }
                        {data?.updatedAt &&
                            <Typography>updated at {formatDate(data.updatedAt)} by {data.updatedBy?.ref && <Link component={RouterLink} to={`/users/${data.updatedBy.ref}`}>{data.updatedBy.username || data.updatedBy.ref}</Link>}</Typography>
                        }
                    </Box>
                </Paper>
            }
            {!error && !data && loading && <Skeleton variant="rectangular" />}
        </>
    );
}