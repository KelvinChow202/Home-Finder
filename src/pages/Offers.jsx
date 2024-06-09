import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner'
import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-toastify'
import ListingItem from '../components/ListingItem'

export default function Offer() {
    const [loading, setLoading] = useState(true)
    const [lastFectchedListing, setLastFectchedListing] = useState(null)
    const [listing, setListing] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    

    useEffect(() => {
        async function fetchListings() {
            const q = query(collection(db, 'listings'),
                where('offer', '==', true), limit(5), orderBy('timestamp', 'desc'))
            try {
                const listings = []
                const querySnapshot = await getDocs(q)
                // console.log(querySnapshot.docs); // [querySnapshot,querySnapshot,querySnapshot,querySnapshot]
                const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
                querySnapshot.forEach((doc) => {
                    listings.push({ id: doc.id, data: doc.data() })
                });
                setLastFectchedListing(lastVisible)
                setListing(listings)
                setLoading(false)
            } catch (error) {
                console.log(error);
            }
        }
        fetchListings()
    }, [])

    async function onFetchMoreListings() {
        setLoading(true)
        const q = query(collection(db, 'listings'),
            where('offer', '==', true), limit(5), orderBy('timestamp', 'desc'), startAfter(lastFectchedListing))
        try {
            const listings = []
            const querySnapshot = await getDocs(q)
            console.log(querySnapshot.docs);
            if (querySnapshot.docs.length === 0) {
                // setListing(prevListing => [...prevListing])
                toast.info('No more listings')
                setLoading(false)
                return
            }
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
            querySnapshot.forEach((doc) => {
                listings.push({ id: doc.id, data: doc.data() })
            });
            setLastFectchedListing(lastVisible)
            setListing(prevListing => [...prevListing, ...listings])
            setLoading(false)
        } catch (error) {
            toast.error('Could not fetch more listings')
            console.log(error);
        }
    }

    return (
        <div className='max-w-6xl mx-auto pb-16'>
            <h1 className='font-bold mt-6 text-center text-3xl'>Offers</h1>
            {loading ? <Spinner /> : listing && listing.length > 0 ? (
                <main>
                    <ul className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {
                            listing.map(item => <ListingItem key={item.id} item={item.data} id={item.id} />)
                        }
                    </ul>
                    {
                        lastFectchedListing &&
                        <div className='flex justify-center mt-6'>
                            <button onClick={onFetchMoreListings}
                                className='px-5 py-1.5 bg-white text-gray-700 border border-gray-300 
                            hover:border-slate-600 rounded-lg transition duration-200 ease-in-out'>
                                Load more
                            </button>
                        </div>
                    }
                </main>
            ) : <p className='font-bold text-center text-5xl mt-20'>There are no current offers</p>}
        </div>
    )
}
