import { IUser } from '../user/IUser.interface'

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
