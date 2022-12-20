/* eslint-disable import/no-named-as-default */
import InvitationType from '../../enums/invitation.enum'
import { IGroup } from '../group'
import { IPresentation } from '../presentation'
import { IUser } from '../user'

export interface IInvitation {
    id: string

    inviter: IUser

    inviteeEmail: string

    group?: IGroup

    presentation?: IPresentation

    invitationExpireAt: Date

    type: InvitationType
}
