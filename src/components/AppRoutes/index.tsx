import { lazy } from 'react';
import { Routes, Route } from "react-router-dom";
import UsersScreen from '../../screens/Users';

const DashboardScreen = lazy(() => import('../../screens/Dashboard'));
const ApplicationsScreen = lazy(() => import('../../screens/Applications'));
const ApplicationDetailScreen = lazy(() => import('../../screens/ApplicationDetails'));
const UserDetailScreen = lazy(() => import('../../screens/UserDetails'));

export default function AppRoutes(): JSX.Element {
    return (
        <Routes>
            <Route path="/" element={<DashboardScreen />} />
            <Route path="/applications/:id" element={<ApplicationDetailScreen />} />
            <Route path="/applications" element={<ApplicationsScreen />} />
            <Route path="/users" element={<UsersScreen />} />
            <Route path="/users/:id" element={<UserDetailScreen />} />
            <Route path="/users/create" element={<UserDetailScreen />} />
        </Routes>
    );
}