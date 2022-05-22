import { Alert, Avatar, Box, Button, Checkbox, Container, FormControlLabel, LinearProgress, Paper, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React, { useCallback, useContext, useState } from "react";
import useDispatch from "../../hooks/dispatch";
import { SessionContext } from "../../hooks/session";

interface SigninState { 
    pending: boolean
    error?: Error
    username: string
    password: string
    remember: boolean 
}

export default function LoginScreen({ error: iniitalError }: { error?: Error }) {
    const session = useContext(SessionContext);
    const { username: sessionUserName = '' } = session.getState();
    const [{ username, password, remember, pending, error }, setState] = useState<SigninState>({ pending: false, error: iniitalError, username: sessionUserName, password: '', remember: !!sessionUserName });
    const dispatch = useDispatch();
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        setState(current => ({
            ...current,
            [name]: name === 'remember' ? event.target.checked : event.target.value
        }))
    }, [setState]);
    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {        
        event.preventDefault();
        if (!pending && username && password) {                    
            setState((current) => ({ ...current, pending: true, error: undefined }));
            fetch(`https://localhost:9001/authenticate`, { 
                method: 'POST', 
                body: JSON.stringify({
                    username,
                    password
                })
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then(({ token }) => {
                        session.setState({ token, username, remember });
                        setState((current) => ({ ...current, pending: false, error: undefined }));
                        dispatch({ type: 'signin', data: token });
                    }).catch(error => {
                        setState((current) => ({ ...current, pending: false, error }));
                    });
                } else {
                    setState((current) => ({ ...current, pending: false, error: new Error('invalid response') }));
                }
            }).catch(error => {
                setState((current) => ({ ...current, pending: false, error }));
            });
        }
    }, [dispatch, pending, session, username, password, remember]);
    return (
        <Paper sx={{ height: '100vh', display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'center' }} square>
            <Container component="main" maxWidth="xs">                
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    {error && <Alert severity="error">{error.message}</Alert>}
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus={username ? false : true}
                            onChange={handleChange}
                            value={username}
                            disabled={pending}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            autoFocus={username ? true : false}
                            onChange={handleChange}
                            value={password}
                            disabled={pending}
                        />
                        <FormControlLabel
                            control={<Checkbox name="remember" value={remember} checked={remember} color="primary" onChange={handleChange} />}
                            label="Remember me"
                            disabled={pending}
                        />
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={pending}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            {pending && (
                                <LinearProgress/>
                            )}
                        </Box>
                    </Box>                
                </Box>                          
            </Container>
        </Paper>
    );
}