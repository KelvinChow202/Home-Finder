import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../firebase'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { Swiper, SwiperSlide } from 'swiper/react'
import {
    EffectFade,
    Autoplay,
    Navigation,
    Pagination,
} from "swiper/modules";
import "swiper/css/bundle";
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';
import {
    FaShare,
    FaMapMarkerAlt,
    FaBed,
    FaBath,
    FaParking,
    FaChair,
} from "react-icons/fa"


export default function Listing() {

    const [loading, setLoading] = useState(true)
    const [listing, setListing] = useState(null)
    const params = useParams()

    // SwiperCore.use([Autoplay, Navigation, Pagination])

    useEffect(() => {
        async function fetchListing() {
            const docRef = doc(db, 'listings', params.listingId)
            try {
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setListing(docSnap.data())
                } else {
                    toast.warning('No such listing')
                }
            } catch (error) {
                console.log(error);
                toast.error('Fetching listing failed')
            } finally {
                setLoading(false)
            }
        }
        fetchListing()
    }, [params.listingId])

    if (loading) return <Spinner />
    return (
        <main>
            <Swiper
                modules={[Autoplay, Navigation, Pagination, EffectFade]}
                slidesPerView={1}
                navigation
                pagination={{ type: 'progressbar' }}
                effect='fade'
                autoplay={{ delay: 3000 }}>
                {
                    listing.imageUrls.map((url, index) => (
                        // <SwiperSlide key={index}>
                        //     <img src={url} className='w-max-6xl h-[300px] mx-auto overflow-hidden' />
                        // </SwiperSlide>
                        // <SwiperSlide key={index}>
                        //     <div className="flex justify-center items-center w-6/12 h-[300px] overflow-hidden mx-auto">
                        //         <img src={url} className="object-cover" />
                        //     </div>
                        // </SwiperSlide>
                        <SwiperSlide key={index}>
                            <div className="flex justify-center items-center w-full h-[300px] overflow-hidden">
                            <img src={url} className="h-auto w-full max-w-none" />
                        </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </main>
    )
}
