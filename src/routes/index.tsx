import { Route, Routes } from "react-router-dom";


function Layout() {
    return <></>
}

export default function ApplicationRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />} />
            {/*
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
            */}
        </Routes>
    );
}