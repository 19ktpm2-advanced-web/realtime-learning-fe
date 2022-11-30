/* eslint-disable */
import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import './index.css'
import CreateGroup from './pages/create-group'
import Login from './pages/login'
import Register from './pages/register'
import Home from './pages/home'
import ErrorPage from './pages/error-page'
import Profile from './pages/profile'
import MyGroup from './pages/my-group'
import GroupDetail from './pages/group-detail'
import Activation from 'pages/account-activation'
import NavBar from './components/navBar'
import Presentation from 'pages/presentation'
import PresentationDetail from 'pages/presentation-detail'
import AnswerChart from './components/answer-chart'
import Slide from './components/slide'
import { socket, SocketContext } from './service'
import AnswerForm from './pages/answer-form'
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
        path: '/verify-email/:emailToken',
        element: <Activation />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/answer-submit-test',
        element: <AnswerForm />,
    },
    {
        path: '/test-chart',
        element: <Slide />,
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
                element: <Home />,
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
            {
                path: '/presentation/:id',
                element: <PresentationDetail />,
            },
            {
                path: '/presentation',
                element: <Presentation />,
            },
        ],
    },
])
const queryClient = new QueryClient()

function App() {
    return (
        <SocketContext.Provider value={socket}>
            <QueryClientProvider client={queryClient} contextSharing>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </SocketContext.Provider>
    )
}

export default App
