/* eslint-disable */
import './index.css'
import { Menu } from 'antd'
import { HomeOutlined, UsergroupAddOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import instance from 'service/axiosPrivate'
import { failureModal } from 'components/modals'

const NavBar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { mutate } = useMutation((logOutData) => {
        return instance.post('/auth/log-out', logOutData)
    })

    const handleLogOut = (data: any) => {
        mutate(data, {
            onSuccess: (res) => {
                if (res.status === 200) {
                    localStorage.removeItem('session')
                    navigate('/login')
                } else {
                    failureModal('Log out failed', res.data.message)
                }
            },
            onError: (error: any) => {
                failureModal('Log out failed', error.response && error.response.data)
            },
        })
    }

    const handleClick = ({ key }: any) => {
        if (key === '/logout') {
            const currentSession = JSON.parse(localStorage.getItem('session') || '')
            handleLogOut(currentSession)
        } else {
            navigate(key)
        }
    }
    return (
        <Menu mode="horizontal" defaultSelectedKeys={[location.pathname]} onClick={handleClick}>
            <Menu.Item key="/" icon={<HomeOutlined />}>
                Home
            </Menu.Item>
            <Menu.Item key="/my-group" icon={<UsergroupAddOutlined />}>
                My groups
            </Menu.Item>
            <Menu.Item key="/profile" icon={<UserOutlined />} className="right-align">
                Account
            </Menu.Item>
            <Menu.Item key="/logout" icon={<LogoutOutlined />} danger>
                Sign out
            </Menu.Item>
        </Menu>
    )
}

export default NavBar
