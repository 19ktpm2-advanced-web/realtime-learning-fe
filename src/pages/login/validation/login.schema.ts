import * as yup from 'yup'

const loginValidationSchema = yup.object().shape({
    email: yup.string().required('Email is required').email('Wrong email format'),
    password: yup.string().required('Password is required'),
})

export default loginValidationSchema
