import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { toast } from 'react-toastify'
import Spinner from './Spinner'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
    EffectFade,
    Autoplay,
    Navigation,
    Pagination,
} from "swiper/modules"
import "swiper/css/bundle"
import { useNavigate } from 'react-router'

export default function Slider() {

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchListings() {
            const q = query(collection(db, 'listings'), orderBy('timestamp', 'desc'), limit(5))
            try {
                const listings = []
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach(docSnapshot => {
                    listings.push({ id: docSnapshot.id, data: docSnapshot.data() })
                })
                setListings(listings)
                // setListings([])
                setLoading(false)
            } catch (error) {
                console.log(error);
                toast.error('Fetching listings failed')
            }
        }
        fetchListings()
    }, [])

    if (loading) {
        return <Spinner />
    }
    if (listings.length === 0) {
        return <><h1 className='font-bold text-center text-3xl mt-10'>There are not any listings right now</h1></>
    }
    return (
        <>
            {listings && (
                <Swiper
                    modules={[Autoplay, Navigation, Pagination, EffectFade]}
                    slidesPerView={1}
                    navigation
                    effect='fade'
                    autoplay={{ delay: 1000 }}
                >
                    {
                        listings.map(listing => (
                            <SwiperSlide key={listing.id} onClick={() => navigate(`/category/${listing.data.type}/${listing.id}`)} className='cursor-pointer'>
                                <div
                                    style={{
                                        background: `url(${listing.data.imageUrls[0]}) center no-repeat`,
                                        backgroundSize: "cover",
                                    }}
                                    className="relative w-full h-[300px] overflow-hidden"
                                ></div>
                                <p className='absolute top-3 left-5 text-[#f1faee] bg-[#457b9d] px-3 py-2 rounded-br-3xl font-semibold shadow-lg opacity-90'>{listing.data.name}</p>
                                <p className='absolute bottom-3 left-5 text-[#f1faee] bg-[#e63946] px-3 py-2 rounded-tr-3xl font-medium shadow-lg opacity-90'>
                                $
                                {
                                    listing.data.offer ? listing.data.discountedPrice.toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.data.regularPrice.toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                {listing.data.type === 'rent' ? ' / month': ''}
                                </p>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            )}
        </>
    )
}
