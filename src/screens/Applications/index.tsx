import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Applications() {
    console.log(`<Applications/>`);
    return (
        <Box>
            <Typography variant="h2">Applications</Typography>
            <Outlet />
        </Box>
    );
}