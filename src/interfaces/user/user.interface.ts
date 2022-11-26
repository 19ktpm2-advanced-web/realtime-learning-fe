import { IRole } from 'interfaces/role'

export interface IUser {
    _id?: string
    email: string
    fullName: string
    avatar: string
    phoneNumber: string
    gender: string
    dateOfBirth: string
}
export interface IMember extends IUser {
    role: IRole
}
