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
import {
    FaShare,
    FaMapMarkerAlt,
    FaBed,
    FaBath,
    FaParking,
    FaChair,
} from "react-icons/fa"
import { getAuth } from 'firebase/auth'
import Contact from '../components/Contact'
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"


export default function Listing() {

    const [loading, setLoading] = useState(true)
    const [listing, setListing] = useState(null)
    const [contactLandlord, setContactLandlord] = useState(false)
    const auth = getAuth()
    const params = useParams()

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

    function copyLink() {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied', { autoClose: 500 })
    }


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
                        <SwiperSlide key={index}>
                            <div className="flex justify-center items-center w-full h-[300px] overflow-hidden">
                                <img src={url} alt='house picture' className="h-auto w-full max-w-none" />
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            <div onClick={copyLink}
                className='fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer rounded-full border-2 border-gray-400 w-12 h-12 flex justify-center items-center'>
                <FaShare className='text-lg text-slate-500' />
            </div>
            <div className='bg-white max-w-6xl mx-auto mb-28 pb-10 flex flex-col md:flex-row mt-10 p-3 rounded-lg shadow-lg md:space-x-5 space-y-5 md:space-y-0'>
                <div className='w-full'>
                    <p className='text-2xl font-bold mb-3 text-blue-900 truncate'>
                        {listing.name} - ${' '}
                        {
                            listing.offer ? listing.discountedPrice.toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice.toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        {
                            listing.type === 'rent' ? ' / month' : ''
                        }
                    </p>
                    <p className='flex items-center font-semibold mb-3'>
                        <FaMapMarkerAlt className='mr-1 text-green-700' />
                        {listing.address}
                    </p>
                    <div className='flex items-center space-x-4 w-[50%] mb-3'>
                        <p className='bg-red-800 max-w-[50%] rounded-lg text-white p-1 text-sm font-semibold text-center'>
                            For {listing.type === 'rent' ? 'Rent' : 'Sale'}
                        </p>
                        {
                            listing.offer && <p className='bg-green-800 max-w-[50%] rounded-lg text-white p-1 text-sm text-center'>
                                ${(listing.regularPrice - listing.discountedPrice)} discount
                            </p>
                        }
                    </div>
                    <p className='mb-3'>
                        <span className='font-semibold'>Description </span>
                        - {listing.description}
                    </p>
                    <div className='flex space-x-3 text-sm whitespace-nowrap truncate font-semibold mb-5'>
                        <p className='flex items-center'>
                            <FaBed className='mr-1 text-lg' />
                            {listing.bedrooms}
                            {' '}
                            {listing.bedrooms > 1 ? 'Beds' : 'Bed'}
                        </p>
                        <p className='flex items-center'>
                            <FaBath className='mr-1 text-lg' />
                            {listing.bathrooms}
                            {' '}
                            {listing.bathrooms > 1 ? 'Baths' : 'Bath'}
                        </p>
                        <p className='flex items-center'>
                            <FaParking className='mr-1 text-lg' />
                            {listing.parking}
                            {' '}
                            {listing.parking === true ? 'Parking Spot' : 'No Parking'}
                        </p>
                        <p className='flex items-center'>
                            <FaChair className='mr-1 text-lg' />
                            {listing.furnish}
                            {' '}
                            {listing.furnish === true ? 'Furnished' : 'No furnished'}
                        </p>
                    </div>

                    {/* 只有出post嗰啲人，先可以撳呢個掣 */}
                    {
                        listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
                            <button onClick={() => setContactLandlord(true)}
                                className='bg-blue-600 text-white px-7 py-3 font-medium text-sm uppercase rounded-lg 
                    shadow-md hover:shadow-lg hover:bg-blue-700 transition ease-in-out duration-200
                    focus:bg-blue-700 focus:shadow-lg w-full text-center'>
                                Contact Landlord
                            </button>
                        )
                    }
                    {
                        contactLandlord && <Contact userRef={listing.userRef} listing={listing} />
                    }
                </div>
                <div className='h-[200px] md:h-[400px] w-full'>
                <MapContainer center={[listing.geolocation.lat,listing.geolocation.lng]} zoom={13} scrollWheelZoom={false} style={{height:'100%', width:'100%'}}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[listing.geolocation.lat,listing.geolocation.lng]}>
                            <Popup>
                                {listing.address}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </main>
    )
}
