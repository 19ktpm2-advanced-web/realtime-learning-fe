import { IPresentation } from 'interfaces'

const presentationSample: IPresentation[] = [
    {
        id: '1',
        name: 'sample 1',
        description: 'sample description 1',
        createdBy: 'me',
        isPresenting: false,
        inviteCode: '12',
    },
    {
        id: '2',
        name: 'sample 2',
        description: 'sample description 2',
        createdBy: 'me',
        isPresenting: false,
        inviteCode: '13',
    },
    {
        id: '3',
        name: 'sample 3',
        description: 'sample description 3',
        createdBy: 'me',
        isPresenting: true,
        inviteCode: '14',
    },
]
export default presentationSample
