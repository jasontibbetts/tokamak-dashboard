import { Routes, Route } from "react-router-dom";
import App from "./App";
import Users from "./screens/Users";
import UsersList from "./screens/Users/list";
import UserDetails from "./screens/Users/details";
/*
import ApplicationsScreen from "./screens/Applications";
import ApplicationDetailsScreen from "./screens/ApplicationDetails";
*/

export default function AppRoutes() {
    console.log(`<AppRoutes/>`)
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="users" element={<Users />}>
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<UserDetails />} />
                </Route>
                {/*
                <Route path="users" element={<ApplicationsScreen />}>
                    <Route index element={<ApplicationsScreen />} />
                    <Route path=":id" element={<ApplicationDetailsScreen />} />
                </Route>
                */}
            </Route>
        </Routes>
    );
}