import { IUser } from '../user/user.interface'

export interface IGroup {
    id: string
    name: string
    description?: string
    background: string
    avatar?: string
    members?: IUser[]
    owner?: IUser
    coOwners?: IUser[]
}
