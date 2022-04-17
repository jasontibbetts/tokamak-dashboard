import { Avatar, List, ListItemAvatar, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import useAuthToken from "../../hooks/auth-token";

function useData<T>(): T | undefined | Error {
    const token = useAuthToken();
    const [state, setState] = useState<{ loading: boolean, data?: T,error?: Error }>({ loading: true });
    useEffect(() => {
        if (token) {
            fetch('https://localhost:9001/applications', {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then(resp => {
                if (resp.ok) {
                    resp.json().then(data => {
                        setState({ loading: false, error: undefined, data });
                    }).catch(e => {
                        setState({ loading: false, error: e, data: undefined });
                    });
                } else {
                    setState({ loading: false, error: new Error('invalid response'), data: undefined });
                }
            }).catch(e => {
                setState({ loading: false, error: e, data: undefined });
            });
        }
    }, [token]);
    return state.loading ? undefined : state.data;
}

export default function ApplicationsScreen() {
    const applications = useData<{ id: string, name: string }[]>();
    return (
        <>
            <List>
                {applications && !(applications instanceof Error) && applications.map(({ id, name }) => 
                    <ListItemAvatar key={id}>
                        <Avatar>

                        </Avatar>
                        <ListItemText primary={name} secondary={id} />
                    </ListItemAvatar>
                )}
                
            </List>
        </>
    );
}