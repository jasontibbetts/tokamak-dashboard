import { Button, LinearProgress, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAPIFetch } from "../../hooks/api";
import useAuthToken from "../../hooks/auth-token";

interface ApplicationRecord {
    id: string
    name: string
    createdAt: number
    createdBy: string
    updatedAt?: number
    updatedBy?: string
}

export default function ApplicationDetailsScreen(): JSX.Element {
    const { id = '' } = useParams();
    const [application,] = useAPIFetch<ApplicationRecord>(`/applications/${id}`);
    const token = useAuthToken();
    const [state, setState] = useState<{ application?: ApplicationRecord | Error, loading?: boolean }>({ application, loading: application === undefined });
    const handleSubmit = useCallback((event: FormEvent) => {
        event.preventDefault();
        const data = JSON.stringify(state.application);
        setState(current => ({
            ...current,
            loading: true
        }));
        fetch(`https://localhost:9001/applications/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: data
        }).then(response => {
            if (response.ok) {
                setState({
                    application: state.application,
                    loading: false
                })
            }
        }).catch(error => {
            setState({ application: error, })
        });
    }, [state.application, token, id]);
    const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = event.target.name;
        const value = event.target.value;
        setState(current => {
            if (current.application && !(current.application instanceof Error)) {
                return {
                    ...current,
                    application: {
                        ...current.application,
                        [key]: value
                    }
                }
            }
            return current;
        });
    }, []);
    useEffect(() => {
        if (application && !(application instanceof Error)) {
            setState({ application, loading: false });
        }
    }, [application]);
    const created = state.application && !(state.application instanceof Error) ? new Date(state.application.createdAt) : undefined;
    const updated = state.application && !(state.application instanceof Error) && state.application.updatedAt ? new Date(state.application.updatedAt) : undefined;
    return (
        <Box sx={{ padding: '0.5em' }}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <>
                    {state.loading && <LinearProgress />}
                    {state.application && !(state.application instanceof Error) &&
                        <>
                            <Paper variant={'outlined'} sx={{ padding: '0.5em' }}>
                                <TextField value={state.application.name} label={'Application Name'} required onChange={handleInputChange} name={'name'} margin={'normal'} />
                                {created && <Typography>Created at <time dateTime={created.toISOString()}>{created.toLocaleDateString()} {created.toLocaleTimeString()}</time> by {state.application.createdBy}</Typography>}
                                {updated && <Typography>Updated at <time dateTime={updated.toISOString()}>{updated.toLocaleDateString()} {updated.toLocaleTimeString()}</time> by {state.application.updatedBy}</Typography>}
                            </Paper>
                            <Button type="submit" disabled={application === state.application || state.loading}>save</Button>
                        </>
                    }
                </>
            </Box>
        </Box>
    );
}