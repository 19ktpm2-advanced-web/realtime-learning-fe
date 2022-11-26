import { Privilege, Role } from 'enums'

export default interface IRole {
    name: Role
    permission: Privilege[]
}
