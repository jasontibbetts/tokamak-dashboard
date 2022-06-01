import { Routes, Route } from "react-router-dom";
import App from "./App";
import Users from "./screens/Users";
import UsersList from "./screens/Users/List";
import UserDetails from "./screens/Users/Details";
import Dashboard from "./screens/Dashboard";
import Applications from "./screens/Applications";
import ApplicationsList from "./screens/Applications/List";
import ApplicationDetails from "./screens/Applications/Details";

export default function AppRoutes() {
    console.log(`<AppRoutes/>`)
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />}>
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<UserDetails />} />
                </Route>
                <Route path="applications" element={<Applications />}>
                    <Route index element={<ApplicationsList />} />
                    <Route path=":id" element={<ApplicationDetails />} />
                </Route>
            </Route>
        </Routes>
    );
}