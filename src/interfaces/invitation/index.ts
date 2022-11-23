import IGroup from '../group'
import { IUser } from '../user'

export interface IInvitation {
    _id?: string

    inviter: IUser

    inviteeEmail: string

    group: IGroup

    invitationExpireAt: Date
}
