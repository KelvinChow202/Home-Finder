import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'

export function useAuthStatus() {

    const auth = getAuth()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const [user,setUser] = useState({})

    useEffect(()=>{
        onAuthStateChanged(auth, user => {
            if(user){
                setIsLoggedIn(true)
                setIsChecking(false)
                setUser(user)
            }
            setIsChecking(false)
        })
    },[])

    return {isLoggedIn, isChecking,user}
}
