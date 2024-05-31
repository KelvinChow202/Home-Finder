import React, { useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { toast } from 'react-toastify'
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from '../firebase'
import { useNavigate } from 'react-router'

export default function OAuth() {

    const provider = new GoogleAuthProvider()
    const auth = getAuth()
    const navigate = useNavigate()

    async function onGoogleClick() {
        try {
            const result = await signInWithPopup(auth, provider)
            const user = result.user
            const { uid, displayName, email } = user
            // 睇下呢個 account 之前有冇註冊過
            const docRef = doc(db, 'users', uid)
            const docSnap = await getDoc(docRef)
            // 冇嘅話就將 account 放入數據庫
            if (!docSnap.exists()) {
                await setDoc(doc(db, 'users', uid), {
                    email: email,
                    fullName: displayName,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')
            toast.success(`Hi ${displayName}`)
        } catch (error) {
            const errorCode = error.code;
            if(errorCode === 'auth/popup-closed-by-user') return;
            toast.error(`Soemthing went wrong with the registration: ${errorCode.replace("auth/", "")}`, { autoClose: 2000 })
        }
    }

    return (
        <button
            type='button'
            onClick={onGoogleClick}
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
