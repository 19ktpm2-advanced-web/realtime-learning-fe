import { SlideType } from 'enums'

export const generatePresentationLink = (
    presentationCode: string,
    type?: SlideType,
    groupId?: string,
): { path: string; url: string } => {
    let path
    let url
    path = `/present/${presentationCode}`
    url = `${process.env.REACT_APP_BASE_URL}/present/${presentationCode}`
    if (groupId) {
        path = `${path}/${groupId}`
        url = `${url}/${groupId}`
    }
    return {
        path,
        url,
    }
}
