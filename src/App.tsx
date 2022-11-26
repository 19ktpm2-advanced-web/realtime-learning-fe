/* eslint-disable */
import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserRouter, Outlet, Router, RouterProvider, Routes } from 'react-router-dom'
import './index.css'
import CreateGroup from './pages/create-group'
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/home'
import ErrorPage from './pages/error-page'
import Profile from './pages/profile'
import MyGroup from './pages/my-group'
import GroupDetail from './pages/group-detail'
import JoinGroup from './pages/join-group'
import NavBar from './components/navBar'

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        element: (
            <>
                <NavBar />
                <Outlet />
            </>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                id: 'invitation',
                path: '/invitation/:invitationId',
                element: <JoinGroup />,
                loader: ({ params }) => {
                    return params.invitationId
                },
            },
            {
                path: '/profile',
                element: <Profile />,
            },
            {
                path: '/my-group',
                element: <MyGroup />,
            },
            {
                path: '/create-group',
                element: <CreateGroup />,
            },
            {
                path: '/group/:groupId',
                element: <GroupDetail />,
            },
        ],
    },
])
const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient} contextSharing>
            <RouterProvider router={router} />
        </QueryClientProvider>
    )
}

export default App
