import { IGroup } from '../group'
import { IUser } from '../user'

export interface IInvitation {
    id: string

    inviter: IUser

    inviteeEmail: string

    group: IGroup

    invitationExpireAt: Date
}
