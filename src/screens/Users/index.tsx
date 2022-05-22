import { Avatar, Card, Grid, Link, Typography } from "@mui/material";
import { useAPIFetch } from "../../hooks/api";
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

type UserReference = {
    rel: 'User'
    ref: string
    href: string
    username: string
}

export default function UsersScreen(): JSX.Element {
    const users = useAPIFetch<UserReference[]>('/users');    
    return (
        <Grid container spacing={4}>
            { users && !(users instanceof Error) &&  
                users.map(({ username, ref }) => <Grid item key={ref}>                    
                    <Card sx={{ padding: '1rem' }}>
                        <Link to={`/users/${ref}`} component={RouterLink}>
                            <Avatar/>
                            <Typography>{username}</Typography>
                        </Link>
                    </Card>                    
                </Grid>)
            }
        </Grid>
    );
}