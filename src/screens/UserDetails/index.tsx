import { Alert, LinearProgress, TextField } from "@mui/material";
import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAPIFetch } from "../../hooks/api";
type UserReference = {
    rel: 'User'
    ref: string
    href: string
    username: string
}
type UserRecord = {
    id: string
    modelType: 'User'
    username: string
    group: 'admin' | 'user'
    createdAt: number
    updatedAt?: number
    createdBy: Omit<UserReference, 'username'>
    updatedBy?: Omit<UserReference, 'username'>
}

export default function () {
    const { id } = useParams();
    const user = useAPIFetch<UserRecord>(`/users/${id}`);
    const handleSubmit = useCallback((evt: React.SyntheticEvent<HTMLFormElement>) => {
        evt.preventDefault();
    }, []);    
    if (user instanceof Error) {
        return <Alert color="error">{user.message}</Alert>
    }
    if (user === undefined) {
        return <LinearProgress />
    }
    return (
        <form onSubmit={handleSubmit}>
            <TextField label="username" name="username" value={user.username}/>
        </form>
    );
}