import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";

const Dashboard = React.lazy(() => import('./screens/Dashboard'));
const Applications = React.lazy(() => import('./screens/Applications'));
const ApplicationsList = React.lazy(() => import('./screens/Applications/List'));
const ApplicationDetails = React.lazy(() => import('./screens/Applications/Details'));
const Users = React.lazy(() => import('./screens/Users'));
const UserDetails = React.lazy(() => import('./screens/Users/Details'));

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />}>
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