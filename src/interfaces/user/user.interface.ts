import { IRole } from 'interfaces/role'

export interface IUser {
    id: string
    email: string
    fullName: string
    avatar: string
    phoneNumber: string
    gender: string
    dateOfBirth: string
    isVerified: boolean
}
export interface IMember extends IUser {
    role: IRole
}
