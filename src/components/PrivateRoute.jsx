import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from './Spinner'

export default function PrivateRoute() {

    const { isLoggedIn, isChecking } = useAuthStatus()

    if (isChecking) return <Spinner />

    return (
        isLoggedIn ? <Outlet /> : <Navigate to={'/sign-in'} />
    )
}
