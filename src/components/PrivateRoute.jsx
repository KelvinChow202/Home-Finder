import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuthStatus } from '../hooks/useAuthStatus'

export default function PrivateRoute() {

    const { isLoggedIn, isChecking, user } = useAuthStatus()
    console.log('isLoggedIn: ', isLoggedIn);
    console.log('isChecking: ', isChecking);
    console.log('user: ', user);

    if (isChecking) return <h1>Loading...</h1>

    return (
        isLoggedIn ? <Outlet /> : <Navigate to={'/sign-in'} />
    )
}
