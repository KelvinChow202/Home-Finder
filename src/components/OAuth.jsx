import React from 'react'
import { FcGoogle } from 'react-icons/fc'

export default function OAuth() {
    return (
        <button
            className='flex items-center justify-center w-full bg-red-600 text-white py-3
                lg:text-sm md:text-base sm:text-lg font-medium hover:bg-red-700 active:bg-red-800 
                transition ease-in-out duration-500
                rounded-lg hover:shadow-xl'
        >
            <FcGoogle className='mr-2 text-2xl rounded-full bg-white' />
            Continue with Google
        </button>
    )
}
