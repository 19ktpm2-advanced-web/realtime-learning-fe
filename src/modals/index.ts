import { Modal } from 'antd'

const timeOut = 8
const options = {
    bodyStyle: {
        maxHeight: '400px',
        OverflowY: 'auto',
    },
    centered: true,
    maskClosable: true,
    autoFocusButton: null,
    closable: true,
}
const failureModal = (title = 'Error!', message = 'Something went wrong') => {
    const modal = Modal.error({
        ...options,
        title,
        // content: `There was a problem when buy this NFT`
        content: message,
    })
    setTimeout(() => {
        modal.destroy()
    }, timeOut * 1000)
}
const successModal = (title = 'Success!', message = 'Successfully') => {
    const modal = Modal.success({
        ...options,
        title,
        content: message,
    })
    setTimeout(() => {
        modal.destroy()
    }, timeOut * 1000)
}

export { failureModal, successModal }
