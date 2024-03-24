import {useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import {Helmet} from 'react-helmet'
import {FaKey, FaTimes, FaCheck, FaEdit} from 'react-icons/fa'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import {useResetPasswordMutation} from '../slices/usersApiSlice'
import {toast} from 'react-toastify'
const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const navigate = useNavigate()
  const [resetPassword, {isLoading}] = useResetPasswordMutation()
  const {search} = useLocation()
  const searchParams = new URLSearchParams(search)
  const pk = searchParams.get('pk')
  const submitHandler = async event => {
    event.preventDefault()
    try {
      const response = await resetPassword({pk, newPassword, confirmNewPassword}).unwrap()
      navigate('/users/list')
      toast.success(response.message)
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }
  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Processing... | Invoices</title>
        </Helmet>
        <Loader/>
      </>
    )
  } else {
    return (
      <>
        <Helmet>
          <title>Reset password | Invoices</title>
        </Helmet>
        <FormContainer>
          <h1><FaKey/> Reset password</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='newPassword' className='my-3'>
              <Form.Label><FaEdit/> New password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter new password'
                value={newPassword}
                onChange={event => setNewPassword(event.target.value)}
                autoFocus
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='confirmNewPassword' className='my-3'>
              <Form.Label><FaCheck/> Confirm new password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm new password'
                value={confirmNewPassword}
                onChange={event => setConfirmNewPassword(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    submitHandler(event);
                  }
                }}
              ></Form.Control>
            </Form.Group>
            <Button
              type='submit'
              variant='success'
              className='m-auto p-auto text-white'
              disabled={isLoading}
            ><FaCheck/> Reset</Button>
            {' '}
            <Button
              type='button'
              variant='danger'
              className='m-auto p-auto text-white'
              disabled={isLoading}
              onClick={() => navigate('/users/list')}
          ><FaTimes/> Cancel</Button>
            {isLoading && <Loader/>}
          </Form>
        </FormContainer>
      </>
    )
  }
}
export default ResetPasswordPage