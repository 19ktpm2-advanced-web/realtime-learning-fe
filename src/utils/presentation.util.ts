import { SlideType } from 'enums'

export const generatePresentationLink = (
    presentationCode: string,
    type?: SlideType,
    groupId?: string,
): { path: string; url: string } => {
    let path
    let url
    if (type === SlideType.MULTIPLE_CHOICE) {
        path = `/answer-form/${presentationCode}`
        url = `${process.env.REACT_APP_BASE_URL}/answer-form/${presentationCode}`
    } else {
        path = `/present/${presentationCode}`
        url = `${process.env.REACT_APP_BASE_URL}/present/${presentationCode}`
    }
    if (groupId) {
        path = `${path}/${groupId}`
        url = `${url}/${groupId}`
    }
    return {
        path,
        url,
    }
}
