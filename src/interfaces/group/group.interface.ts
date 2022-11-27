import { IMember } from '../user/user.interface'

export interface IGroup {
    id: string
    name: string
    description?: string
    background: string
    avatar?: string
    members: IMember[]
    owner: IMember
    coOwners: IMember[]
}
