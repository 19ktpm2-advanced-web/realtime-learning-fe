import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import CreateGroup from 'pages/create-group'
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/home'
import ErrorPage from './pages/error-page'
import Profile from './pages/profile'
import Group from './pages/group'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/profile',
        element: <Profile />,
    },
    {
        path: '/group',
        element: <Group />,
    },
    {
        path: '/create-group',
        element: <CreateGroup />,
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
