import { CloudUpload as CloudUploadIcon, Web, CloudDone as CloudDoneIcon, Cloud as CloudIcon, Settings as SettingsIcon } from "@mui/icons-material";
import { Alert, LinearProgress, Box, Grid, Card, CardHeader, CardContent, CardActions, IconButton, Typography, Badge, Link, Tooltip, List, ListItem, ListItemIcon, Fab } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouterLink } from 'react-router-dom';
import { useAPIFetch } from "../../hooks/api";

interface ApplicationRecord {
    id: string
    name: string
    type: string
    activeDeployment?: { href: string, rel: string }
    canaryDeployment: { href: string, rel: string }
    testDeployments: number
    createdAt: number
    createdBy: string
    updatedAt?: number
    updatedBy?: string
}

function ApplicationCard({ application }: { application: ApplicationRecord }): JSX.Element {
    const { id, name, canaryDeployment, testDeployments, activeDeployment, createdAt, createdBy, updatedAt, updatedBy } = application;
    const created = new Date(createdAt);
    const updated = updatedAt ? new Date(updatedAt) : undefined;
    return <>NYI</>;
    /*
    return (
        <Grid item key={id}>
            <Card sx={{ minWidth: '300px'}}>
                <CardHeader 
                    title={name} 
                    avatar={<Web fontSize="large"/>} 
                    action={<Tooltip title="Application Details"><Link component={RouterLink} to={`/applications/${id}`}><SettingsIcon /></Link></Tooltip>}
                    subheader={id}
                />
                <CardContent>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <AddIcon fontSize="small" color="disabled"/>
                            </ListItemIcon>
                            <Typography variant="caption">Created <time dateTime={created.toISOString()}>{created.toLocaleDateString()} {created.toLocaleTimeString()}</time> by {createdBy}</Typography>
                        </ListItem>
                        {updated &&
                            <ListItem>
                                <ListItemIcon>
                                    <EditIcon fontSize="small" color="disabled"/>
                                </ListItemIcon>
                                <Typography variant="caption">Updated <time dateTime={created.toISOString()}>{updated.toLocaleDateString()} {updated.toLocaleTimeString()}</time> by {updatedBy}</Typography>
                            </ListItem>
                        }
                    </List>
                </CardContent>
                <CardActions>
                    <Tooltip title="Active Deployment details">
                        <span>
                        <IconButton disabled={!activeDeployment}>
                            <CloudDoneIcon color={activeDeployment ? 'success' : 'disabled'} />
                        </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Canary Deployment details">
                        <span>
                        <IconButton  disabled={!canaryDeployment}>
                            <CloudUploadIcon color={canaryDeployment ? 'warning' : 'disabled'} />
                        </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Test Deployments">
                        <IconButton>
                            <Badge badgeContent={testDeployments}><CloudIcon  sx={{ flexGrow: 0 }}/></Badge>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Application">
                        <IconButton>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </Card>
        </Grid>
    );
    */
}

export default function ApplicationsScreen() {
    const [applications] = useAPIFetch<ApplicationRecord[]>('/applications');
    return (
        <Box sx={{ display: 'flex', flex: '1 1 100%', flexFlow: 'column nowrap', minHeight: '33vh', maxHeight: '100vh', padding: '1em' }}>
            {applications instanceof Error && <Alert severity="error">{applications.message}</Alert>}
            {!applications && <LinearProgress />}
            {applications && !(applications instanceof Error) &&
                <Grid container spacing={2}>
                    {applications.map(application => <ApplicationCard application={application} key={application.id} />)}
                </Grid>
            }
            <Fab color="primary" component={RouterLink} to={'/create/application'}><AddIcon arial-label={'add application'} /></Fab>
        </Box>
    );
}