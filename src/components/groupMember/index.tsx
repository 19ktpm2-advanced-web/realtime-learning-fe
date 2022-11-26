import { Avatar, Button, List } from 'antd'
import { failureModal } from 'components/modals'
import { Privilege, Role } from 'enums'
import { IGroup } from 'interfaces'
import { IMember } from 'interfaces/user/user.interface'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import instance from 'service/axiosPrivate'
import styles from './styles.module.css'

function GroupMember({ groupId }: { groupId?: String }) {
    const [members, setMembers] = useState<IMember[]>([])
    const [permission, setPermission] = useState<Privilege[]>([])
    const [showGrant, setShowGrant] = useState(false)
    const [showRevoke, setShowRevoke] = useState(false)
    const [showKickOut, setShowKickOut] = useState(false)
    const getAllMember = (group: IGroup) => {
        if (group.owner) {
            setMembers([group.owner])
        }
        if (group.coOwners) {
            setMembers((prev) => [...prev, ...group.coOwners])
        }
        if (group.members) {
            setMembers((prev) => [...prev, ...group.members])
        }
    }
    const grantRole = async (memberId: string) => {
        try {
            const res = await instance.post(`/group/grantRole/${groupId}`, {
                memberId,
            })
            if (res.status === 200) {
                getAllMember(res.data.group)
                setPermission(res.data.permission)
            } else {
                failureModal('Grant role failed', res.statusText)
            }
        } catch (error) {
            console.error(error)
            failureModal('Grant role failed', error.response && error.response.data)
        }
    }
    const revokeRole = async (memberId: string) => {
        try {
            const res = await instance.post(`/group/revokeRole/${groupId}`, {
                memberId,
            })
            if (res.status === 200) {
                getAllMember(res.data.group)
                setPermission(res.data.permission)
            } else {
                failureModal('Revoke role failed', res.statusText)
            }
        } catch (error) {
            console.error(error)
            failureModal('Revoke role failed', error.response && error.response.data)
        }
    }
    const kickOut = async (memberId: string) => {
        try {
            const res = await instance.post(`/group/removeMember/${groupId}`, {
                memberId,
            })
            if (res.status === 200) {
                getAllMember(res.data.group)
                setPermission(res.data.permission)
            } else {
                failureModal('Kick out failed', res.statusText)
            }
        } catch (error) {
            console.error(error)
            failureModal('Kick out failed', error.response && error.response.data)
        }
    }
    useQuery(['groupDetail'], async () => {
        const res = await instance.get(`/group/get/${groupId}`)
        if (res.status === 200) {
            const { group }: { group: IGroup } = res.data
            getAllMember(group)
            setPermission(res.data.permission)
        } else {
            failureModal('Failed to get group detail', res.statusText)
        }
    })
    useEffect(() => {
        setShowGrant(permission.includes(Privilege.GRANTING))
        setShowRevoke(permission.includes(Privilege.REVOKING))
        setShowKickOut(permission.includes(Privilege.KICKING))
    }, [permission])
    return (
        <div className={styles.wrapper}>
            <List
                header={<h2>All Members</h2>}
                itemLayout="horizontal"
                dataSource={members}
                renderItem={(member: IMember) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={member.avatar} />}
                            title={member?.fullName}
                            description={`${member?.email}`}
                        />
                        <List.Item.Meta title={member.role.name} />
                        <div className={styles.controlWrapper}>
                            {showGrant && member.role.name === Role.MEMBER && (
                                <Button
                                    type="primary"
                                    className={styles.controlButton}
                                    onClick={() => {
                                        grantRole(member._id)
                                    }}
                                >
                                    Grant
                                </Button>
                            )}
                            {showRevoke && member.role.name === Role.CO_ADMINISTRATOR && (
                                <Button
                                    type="primary"
                                    danger
                                    className={styles.controlButton}
                                    onClick={() => {
                                        revokeRole(member._id)
                                    }}
                                >
                                    Revoke
                                </Button>
                            )}
                            {showKickOut && member.role.name === Role.MEMBER && (
                                <Button
                                    type="primary"
                                    danger
                                    className={styles.controlButton}
                                    onClick={() => {
                                        kickOut(member._id)
                                    }}
                                >
                                    Kick Out
                                </Button>
                            )}
                        </div>
                    </List.Item>
                )}
            />
        </div>
    )
}
export default GroupMember
