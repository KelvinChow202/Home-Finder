import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { toast } from 'react-toastify'

export default function Contact(props) {

    const { userRef, listing } = props
    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        async function getLandlord() {
            try {
                const docSnap = await getDoc(doc(db, 'users', userRef))
                if (docSnap.exists()) {
                    setLandlord(docSnap.data())
                } else {
                    toast.error('Could not get landlord data')
                }
            } catch (error) {
                console.log(error);
                toast.error('Could not get landlord data')
            }
        }
        getLandlord()
    }, [userRef])

    function onMessageChange(e) {
        setMessage(e.target.value)
    }

    return (
        <>
            {landlord !== null && (
                <div className='flex flex-col'>
                    <p>
                        Contact {landlord.name} for the {listing.name.toLowerCase()}
                    </p>
                    <textarea className='resize-none mt-3 mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded-3xl focus:text-gray-700 focus:bg-white focus:border-slate-600 transition ease-in-out duration-200'
                    name='message' id='message' value={message} onChange={onMessageChange} rows='3' placeholder='Leave your message here' />
                    <a href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
                    className='mt-3x bg-blue-600 px-7 py-3 rounded-lg text-white text-center uppercase shadow-md hover:shadow-lg hover:bg-blue-700 active:bg-blue-700 active:shadow-lg transition ease-in-out duration-200'>
                        Send Message
                    </a>
                </div>
            )}
        </>
    )
}
