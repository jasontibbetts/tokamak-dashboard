import { Button, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Select, TextField } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useAPIFetch } from "../../hooks/api-old";
import { GroupReference, UserRecord } from "./types";

type FormState = {
    error?: Error
    data?: UserRecord
    pristine?: boolean
}

interface UserDetailsFormProps {
    onSubmit: (data: UserRecord) => void
    user?: UserRecord
}

// TODO: Move this back into the userdetails screen so it can better be intetgrated (now that there aren't two seperate components this isn't needed as it's own)

export default function UserDetailsForm({ onSubmit, user }: UserDetailsFormProps) {
    const [state, setState] = useState<FormState>({ pristine: true, data: user });
    const [groups] = useAPIFetch<GroupReference[]>('/groups');
    const handleChange = useCallback((event: any): void => {
        const { value, name } = event.target;
        switch (name) {
            case 'group':
                setState(state => state.data ? ({ ...state, data: { ...state.data, group: { rel: 'Group', ref: value } }, pristine: false }) : state);
                break;
            default:
                setState(state => state.data ? ({ ...state, data: { ...state.data, [name]: value }, pristine: false }) : state);
                break;
        }
    }, []);
    const handleReset = useCallback(() => {
        setState(state => ({ ...state, data: user, pristine: true }));
    }, [user]);
    const handleSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        if (state.data) {
            onSubmit(state.data);
            setState({ ...state, pristine: true });
        }
    }, [onSubmit, state]);
    return (
        <form onSubmit={handleSubmit} noValidate>
            <Grid container gap={2} direction="column">
                <Grid item>
                    <FormControl fullWidth>
                        <TextField autoComplete="off" label="Username" name="username" value={state.data?.username || ''} onChange={handleChange} disabled={!state.data} />
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl fullWidth>
                        <TextField autoComplete="off" label="Password" name="password" type="password" value={state.data?.password || ''} onChange={handleChange} disabled={!state.data} />
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl fullWidth>
                        <InputLabel>Group</InputLabel>
                        {Array.isArray(groups) &&
                            <Select name="group" label="Group" value={state.data?.group.ref || ''} onChange={handleChange} disabled={!state.data}>
                                {groups.map(({ ref }: { ref: string }) => (<MenuItem value={ref} key={ref}>{ref}</MenuItem>))}
                            </Select>
                        }
                        {groups === undefined &&
                            <LinearProgress />
                        }
                    </FormControl>
                </Grid>
                <Grid item>
                    <Grid container direction="row" justifyContent={"flex-end"}>
                        <Button type="submit" variant="contained" disabled={!state.data || state.pristine}>Save</Button>
                        <Button variant="text" disabled={!state.data || state.pristine} onClick={handleReset}>Reset</Button>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
}