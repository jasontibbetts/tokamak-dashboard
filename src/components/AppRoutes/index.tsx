import { Typography } from '@mui/material';
import { lazy } from 'react';
import { Routes, Route, useParams } from "react-router-dom";
import UsersScreen from '../../screens/Users';

const DashboardScreen = lazy(() => import('../../screens/Dashboard'));
const ApplicationsScreen = lazy(() => import('../../screens/Applications'));
const ApplicationDetailScreen = lazy(() => import('../../screens/ApplicationDetails'));
const UserDetailScreen = lazy(() => import('../../screens/UserDetails'));

export default function AppRoutes(): JSX.Element {
    return (
        <Routes>
            <Route path="/" element={<DashboardScreen />}/>
            <Route path="/applications/:id" element={<ApplicationDetailScreen />} />
            <Route path="/applications" element={<ApplicationsScreen />}/>
            <Route path="/users" element={<UsersScreen />} />
            <Route path="/users/:id" element={<UserDetailScreen />} />
        </Routes>
    );
}

type TitleFn = (params: Record<string, string | undefined>) => string | JSX.Element

function AppTitle({ title }: { title: string | TitleFn }): JSX.Element {
    const params = useParams();
    return <Typography>{typeof title === 'string' ? title : title(params)}</Typography>;
}

export function AppTitleRoutes(): JSX.Element {
    return (
        <Routes>
            <Route path="/" element={<AppTitle title={'Dashboard'}/>} />
            <Route path="/applications/:id" element={<AppTitle title={'Application Details'} />} />
            <Route path="/applications" element={<AppTitle title={'Applications'}/>} />
            <Route path="/users" element={<AppTitle title={'Users'}/>} />
            <Route path="/users/:id" element={<AppTitle title={'User Details'} />} />
        </Routes>
    );
}