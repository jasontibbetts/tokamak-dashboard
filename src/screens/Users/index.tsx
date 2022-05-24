import { Avatar, Box, Card, CardActions, CardHeader, Fab, Grid, IconButton } from "@mui/material";
import { useAPIFetch } from "../../hooks/api";
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type UserReference = {
    rel: 'User'
    ref: string
    href: string
    username: string
}

export default function UsersScreen(): JSX.Element {
    const users = useAPIFetch<UserReference[]>('/users');    
    return (
        <Box>
            <Grid container spacing={4}>
                { users && !(users instanceof Error) &&  
                    users.map(({ username, ref }) => <Grid item key={ref}>                    
                        <Card sx={{ padding: '1rem' }}>
                            <CardHeader avatar={<Avatar/>} title={username}/>
                            <CardActions>
                                <IconButton component={RouterLink} to={`/users/${ref}`}>
                                    <EditIcon/>
                                </IconButton>
                                <IconButton onClick={() => {}}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>                    
                    </Grid>)
                }
            </Grid>
            <Fab color="primary" component={RouterLink} to={'/create/user'}>
                <AddIcon arial-label={'add user'}/>
            </Fab>
        </Box>
    );
}