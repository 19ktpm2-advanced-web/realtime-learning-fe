import { SlideType } from 'enums'

export const generatePresentationLink = (
    presentationCode: string,
    type?: SlideType,
): { path: string; url: string } => {
    if (type === SlideType.MULTIPLE_CHOICE) {
        return {
            path: `/answer-form/${presentationCode}`,
            url: `${process.env.REACT_APP_BASE_URL}/answer-form/${presentationCode}`,
        }
    }
    return {
        path: `/present/${presentationCode}`,
        url: `${process.env.REACT_APP_BASE_URL}/present/${presentationCode}`,
    }
}
