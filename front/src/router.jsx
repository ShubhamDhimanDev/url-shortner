import { createBrowserRouter } from "react-router-dom";
import Register from "./views/Register";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Auth from "./views/Auth";
import DefaultLayout from "./components/DefaultLayout";
import MyUrls from "./views/MyUrls";
import AccountSettings from "./views/AccountSettings";
import Redirect from "./views/Redirect";
import LandingPage from "./views/LandingPage";
import PageNotFound from "./views/PageNotFound";
import Analytics from "./views/Analytics";
import Loading from "./views/Loading";
import VerifyEmail from "./views/VerifyEmail";
import ForgotPassword from "./views/ForgotPassword";
import ResetPassword from "./views/ResetPassword";

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: '/loading',
        element: <Loading />
    },
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
            {
                path: '/my-urls',
                element: <MyUrls />
            },
            {
                path: '/analytics/:url',
                element: <Analytics />
            },
            {
                path: '/account-settings',
                element: <AccountSettings />
            }
        ]
    },
    {
        path: '/',
        element: <Auth />,
        children: [
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/forgot-password',
                element: <ForgotPassword />
            },
            {
                path: '/reset-password',
                element: <ResetPassword />
            }
        ]
    },
    {
        path: '/verify-email',
        element: <VerifyEmail />
    },
    {
        path: '/:shortCode',
        element: <Redirect />
    },
    {
        path: '/*',
        element: <PageNotFound />
    }
])

export default router