export interface IQnAQuestion {
    id: string
    question: string
    likeCount: number
    isAnswered: boolean
    isLiked: boolean
    date?: Date
}
