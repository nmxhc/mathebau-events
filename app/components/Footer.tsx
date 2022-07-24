import { Form, Link } from '@remix-run/react'
import { useOptionalAdmin } from '~/utils';



export const Footer = () => {
  const admin = useOptionalAdmin();
  return (
    <footer className='bg-stone-800 border-t-3'>
      <div className='w-full max-w-screen-md mx-auto flex justify-between items-center flex-wrap py-5 px-3 sm:px-5'>
        <div className='mr-4'>
          Mathebau Events - © {new Date().getFullYear()}
        </div>
        { admin
          ? (<span>Hi {admin.name}!
            <Form action='/admin/logout' method='post' className=' text-blue-300 inline-block ml-2'>
              <button type='submit'>Logout</button>
            </Form></span>)
          : (<Link to='/admin/login' className=' text-blue-300'>Admin Login</Link>)}
      </div>
    </footer>
  )
}
