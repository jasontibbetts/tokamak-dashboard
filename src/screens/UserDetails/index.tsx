import { Alert, Box, Divider, LinearProgress, Link, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAPIObjectState } from "../../hooks/api";
import { Link as RouterLink } from 'react-router-dom';
import { UserRecord } from "./types";
import UserDetailsForm from "./Form";
import { useCallback } from "react";

function createNewUserRecord(): UserRecord {
    return {
        id: '',
        modelType: 'User',
        createdAt: 0,
        createdBy: {
            rel: 'User',
            ref: 'self',
            href: ''
        },
        username: '',
        password: '',
        group: {
            rel: 'Group',
            ref: ''
        }
    };
}

export default function UserDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, updateUser] = useAPIObjectState<UserRecord>(id ? `/users/${id}` : undefined, id ? undefined : createNewUserRecord());
    const handleSubmit = useCallback(async (next: UserRecord) => {
        try {
            const result = await updateUser(next);
            if (!id) {
                navigate(`/users/${result.id}`);
            }
        } catch (e) {

        }
    }, [updateUser, id, navigate]);
    if (user instanceof Error) {
        return <Alert color="error">{user.message}</Alert>
    }
    return (
        <Box padding="1rem">
            <Typography variant="h6">{id ? 'Edit' : 'Create'} user</Typography>
            {id && <Typography variant="caption">{id}</Typography>}
            <Divider sx={{ margin: '0.5rem 0' }} />
            {user && id &&
                <>
                    {user.createdAt &&
                        <Typography>
                            Created at {new Date(user.createdAt).toLocaleString()} by {user.createdBy ? <Link component={RouterLink} to={`/users/${user.createdBy.ref}`}>{user.createdBy.ref}</Link> : 'N/A'}
                        </Typography>
                    }
                    {user.updatedAt &&
                        <Typography>
                            Updated at {new Date(user.updatedAt).toLocaleString()} by {user.updatedBy ? <Link component={RouterLink} to={`/users/${user.updatedBy.ref}`}>{user.updatedBy.ref}</Link> : 'N/A'}
                        </Typography>
                    }
                </>
            }
            <Paper elevation={24} sx={{ padding: '1rem', margin: '1rem 0' }}>
                {user === undefined && <LinearProgress />}
                {user && <UserDetailsForm onSubmit={handleSubmit} user={user} />}
            </Paper>
        </Box >
    );
}