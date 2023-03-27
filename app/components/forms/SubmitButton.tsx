import type { FC } from 'react'

export const SubmitButton:FC = ({children}) => {
  return (
    <button
      type="submit"
      data-cy="submit-button"
      className="w-full rounded bg-blue-600  py-2 px-4 text-white hover:bg-blue-700 transition duration-200 ease-in-out"
    >
      {children}
    </button>
  )
}
