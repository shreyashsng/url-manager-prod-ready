import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-6'>
        
        <h1 className='text-2xl font-semibold mb-2'>URL Not Found</h1>
        <p className='text-lg text-gray-600 mb-6'>This is a 404 error, which means you've clicked on a bad link or entered an invalid URL. Maybe what you are looking for can be found at <Link to={"/"} className='underline'>Home</Link></p>
    </div>
  )
}

export default NotFound