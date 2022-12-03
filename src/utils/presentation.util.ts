/* eslint-disable */
export const generatePresentationLink = (presentationCode: string): string => {
    return `${process.env.REACT_APP_BASE_URL}/answer-form/${presentationCode}`
}
