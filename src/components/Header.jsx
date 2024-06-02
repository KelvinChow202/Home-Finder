import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Header() {

    const [title,setTitle] = useState('Sign in')

    const location = useLocation()
    const navigate = useNavigate()
    const auth = getAuth()

    useEffect(()=>{
        onAuthStateChanged(auth, user => {
            if(user){
                setTitle('Profile')
            }else{
                setTitle('Sign in')
            }
        })
    },[auth])

    function isRouteMatch(url) {
        return url === location.pathname
    }

    return (
        <div className='bg-white border-b border-slate-200 shadow-md sticky top-0 z-50'>
            <header className='flex justify-between items-center max-w-6xl mx-auto'>
                <div>
                    <img src='https://static.rdc.moveaws.com/rdc-ui/logos/logo-brand.svg' alt='logo'
                        className='h-5 cursor-pointer'
                        onClick={() => navigate('/')}
                    />
                </div>
                <div>
                    <ul className='flex space-x-10'>
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-2 
                                       ${isRouteMatch('/') ? 'text-black border-b-red-500': 'border-b-transparent'}`}
                            onClick={() => navigate('/')}>
                            Home
                        </li>
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-2 
                                       ${isRouteMatch('/offers') ? 'text-black border-b-red-500': 'border-b-transparent'}`}
                            onClick={() => navigate('/offers')}>
                            Offers
                        </li>
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-2 
                                       ${(isRouteMatch('/sign-in') || isRouteMatch('/profile')) ? 'text-black border-b-red-500': 'border-b-transparent'}`}
                            onClick={() => navigate('/profile')}>
                            {title}
                        </li>
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-2 
                                       ${isRouteMatch('/spinner') ? 'text-black border-b-red-500': 'border-b-transparent'}`}
                            onClick={()=>navigate('/spinner')}>
                            Spinner
                        </li>
                    </ul>
                </div>
            </header>
        </div>
    )
}
