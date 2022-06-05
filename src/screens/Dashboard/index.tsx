import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="relative">
                <Toolbar variant="dense">
                    <Typography variant='h6'>Dashboard</Typography>
                </Toolbar>
            </AppBar>
            <Outlet />
        </Box>
    );
}