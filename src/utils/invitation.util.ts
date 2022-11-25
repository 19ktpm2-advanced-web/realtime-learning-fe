/* eslint-disable */
export const generateInvitationLink = (invitationId: string): string => {
    return `${process.env.REACT_APP_BASE_URL}/invitation/${invitationId}`
}
