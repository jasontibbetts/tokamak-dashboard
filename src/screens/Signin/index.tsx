import { Alert, Avatar, Box, Button, Checkbox, Container, FormControlLabel, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useCallback, useContext, useState } from "react";
import useDispatch from "../../hooks/dispatch";
import { SessionContext } from "../../hooks/session";

export default function SigninScreen() {
    const session = useContext(SessionContext);
    const [{ pending, error }, setState] = useState<{ pending: boolean, error?: Error }>({ pending: false, error: undefined});
    const dispatch = useDispatch();
    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!pending) {
            const data = new FormData(event.currentTarget);
            setState({ pending: true, error: undefined });
            fetch(`https://localhost:9001/authenticate`, { 
                method: 'POST', 
                body: JSON.stringify({
                    username: data.get('username'),
                    password: data.get('password')
                })
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then(({ token }) => {
                        session.setState({ token });
                        setState({ pending: false, error: undefined });
                        dispatch({ type: 'signin', data: token });
                    }).catch(e => {
                        setState({ pending: false, error: e });
                    });
                } else {
                    setState({ pending: false, error: new Error('invalid response') });
                }
            }).catch(e => {
                setState({ pending: false, error: e });
            });
        }
    }, [dispatch, pending, session]);
    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center' 
            }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                {error && <Alert severity="error">{error.message}</Alert>}
                <Typography component="h1" variant="h5">
                    Sign in
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
                        autoFocus
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
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        >
                        Sign In
                    </Button>            
                </Box>
            </Box>
        </Container>
    );
}