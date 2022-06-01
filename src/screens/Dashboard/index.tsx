import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
    console.log(`<Dasbhoard/>`);
    return (
        <Box>
            <Typography variant="h2">Dashboard</Typography>
            <Outlet />
        </Box>
    );
}