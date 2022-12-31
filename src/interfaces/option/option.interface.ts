import { IUser } from "interfaces/user"

export interface IAnswerInfo {
    user: IUser
    answeredAt: Date
}
export interface IOption {
    id?: string
    answer?: string
    votes?: number
    answerInfos: IAnswerInfo[]
}