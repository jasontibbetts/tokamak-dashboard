import { Box, Typography } from "@mui/material";
import useApiObjectList from "../../hooks/api/list";
import { ApplicationData } from "../../hooks/api/types";

export default function ApplicationsList() {
    const [apps] = useApiObjectList<ApplicationData, 'name'>('Application');
    return <Box><Typography variant="h3">List</Typography></Box>
}