import { Link } from '@remix-run/react'
import { useOptionalAdmin } from '~/utils';


export const Navbar = () => {
  const admin = useOptionalAdmin();
  return (
    <div className='bg-lime-600 w-full text-lime-50'>
      <nav className='w-full max-w-screen-md mx-auto flex justify-between'>
        <Link to="/">
          <div className='px-3 sm:px-5 py-3 hover:bg-lime-700 transition duration-200 ease-in-out'>Mathebau Events</div>
        </Link>
        {admin && (<Link to="/admin/events">
          <div className='px-3 sm:px-5 py-3 hover:bg-lime-700 transition duration-200 ease-in-out'>Admin Bereich</div>
        </Link>)}
      </nav>
    </div>
  )
}
