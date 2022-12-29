import * as yup from 'yup'

const forgotValidationSchema = yup.object().shape({
    email: yup.string().required('Email is required').email('Wrong email format'),
})

export default forgotValidationSchema
