import { Theme, ThemeProvider } from "@mui/material";
import { AuthContext, UserRecord } from "../../hooks/auth";
import { DispatchContext } from "../../hooks/dispatch";
import { ApplicationAction } from "../../state/reducer";

interface AppContextsProps {
    children?: React.ReactElement
    theme: Theme
    token?: string
    user?: UserRecord
    dispatch: React.Dispatch<ApplicationAction>,
    signout(): void
}

export default function AppContexts({ children, theme, token, dispatch, user, signout }: AppContextsProps): JSX.Element {
    return (
        <ThemeProvider theme={theme}>
            <DispatchContext.Provider value={dispatch}>
                <AuthContext.Provider value={{ token, user, signout }}>
                    {children}
                </AuthContext.Provider>
            </DispatchContext.Provider>
        </ThemeProvider>
    );
}