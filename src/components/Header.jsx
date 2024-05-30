import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Header() {

    const location = useLocation()
    const navigate = useNavigate()

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
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-2 border-b-transparent
                                       ${isRouteMatch('/') && 'text-black border-b-red-500'}`}
                            onClick={() => navigate('/')}>
                            Home
                        </li>
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-2 border-b-transparent
                                       ${isRouteMatch('/offers') && 'text-black border-b-red-500'}`}
                            onClick={() => navigate('/offers')}>
                            Offers
                        </li>
                        <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-2 border-b-transparent
                                       ${isRouteMatch('/sign-in') && 'text-black border-b-red-500'}`}
                            onClick={() => navigate('/sign-in')}>
                            Sign in
                        </li>
                    </ul>
                </div>
            </header>
        </div>
    )
}
