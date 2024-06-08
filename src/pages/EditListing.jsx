import React, { useEffect, useState } from 'react'
import CreateListingButton from '../components/CreateListingButton'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { getAuth } from 'firebase/auth'
import { v4 as uuidv4 } from 'uuid'
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate, useParams } from 'react-router'

export default function EditListing() {


    const auth = getAuth()
    const { currentUser } = auth
    const navigate = useNavigate()
    const params = useParams()
    const { listingId } = params

    const [geolocationEnabled, setGeolocationEnabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState('sale')
    const [name, setName] = useState('')
    const [bedrooms, setBedrooms] = useState(1)
    const [bathrooms, setBathrooms] = useState(1)
    const [parking, setParking] = useState(true)
    const [furnish, setFurnish] = useState(true)
    const [address, setAddress] = useState('')
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [description, setDescription] = useState('')
    const [offer, setOffer] = useState(true)
    const [regularPrice, setRegularPrice] = useState(0)
    const [discountedPrice, setDiscountedPrice] = useState(0)
    const [images, setImages] = useState({})

    const [oldListing, setOldListing] = useState()

    // 每個人只可以改自己嘅post，其他人唔可以改
    useEffect(() => {
        if (oldListing && oldListing.userRef !== currentUser.uid) {
            toast.error("You can't edit this listing");
            navigate('/')
        }
    }, [currentUser.uid, navigate, oldListing])

    useEffect(() => {
        async function fetchListings() {
            setLoading(true)
            const docRef = doc(db, 'listings', listingId)
            try {
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const { type, name, bedrooms, bathrooms, parking, furnish, address, description, offer, regularPrice, discountedPrice } = docSnap.data()
                    setType(type)
                    setName(name)
                    setBedrooms(bedrooms)
                    setBathrooms(bathrooms)
                    setParking(parking)
                    setFurnish(furnish)
                    setAddress(address)
                    setDescription(description)
                    setOffer(offer)
                    setRegularPrice(regularPrice)
                    setDiscountedPrice(discountedPrice)
                    setOldListing(docSnap.data())
                } else {
                    toast.warning('No such listing!')
                }
            } catch (error) {
                console.log(error);
                toast.error('Fetching listings failed.')
            } finally {
                setLoading(false)
            }
        }
        fetchListings()
    }, [listingId])


    async function onFormDataSubmit(e) {
        e.preventDefault()
        setLoading(true)
        const formData = { type, name, bedrooms, bathrooms, parking, furnish, address, description, offer, regularPrice, discountedPrice, images }
        // console.log(formData);
        const geolocation = {}
        if (discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error('Discounted price needs to be less than regular price')
            return
        }
        if (images.length > 6) {
            setLoading(false)
            toast.error('Maximum 6 images are allowed')
            return
        }
        if (geolocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`)
            const data = await response.json()
            // console.log(data);
            const { results, status } = data
            if (status === 'ZERO_RESULTS') {
                toast.error('Please enter a correct address')
                setLoading(false)
                return
            }
            if (status !== 'OK') {
                toast.error('Something went wrong with the Google API...')
                setLoading(false)
                return
            }
            geolocation['lat'] = results[0].geometry.location.lat
            geolocation['lng'] = results[0].geometry.location.lng
            setLoading(false)
        } else {
            geolocation['lat'] = latitude
            geolocation['lng'] = longitude
        }

        [...images].forEach(image => {
            const maxSize = 300 * 1024 * 1024
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
            if (image) {
                if (image.size > maxSize) {
                    toast.error(`The image ${image.name} is too large. Please select an image smaller than 300MB.`)
                    return
                }
                if (!validTypes.includes(image.type)) {
                    toast.error(`The file ${image.name} is not a valid image type. Please select a JPEG or PNG or JPG image.`)
                }
            }
        })

        async function storageImage(image) {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                // const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                const fileName = `house_images/${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, fileName)
                const uploadTask = uploadBytesResumable(storageRef, image)
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        reject(error)
                    },
                    () => {
                        // Upload completed successfully, now we can get the download URL
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL)
                        });
                    }
                );
            })
        }

        const imageUrls = await Promise.all(
            [...images].map(image => storageImage(image))
        ).catch(error => {
            setLoading(false)
            toast.error('Images uploaded failed')
            console.log(error);
            return
        })
        // console.log(imageUrls);
        delete formData.images
        !offer && delete formData.discountedPrice
        formData['imageUrls'] = imageUrls
        formData['timestamp'] = serverTimestamp()
        formData['userRef'] = auth.currentUser.uid
        formData['geolocation'] = geolocation

        try {
            const docRef = doc(db, "listings", listingId);
            await updateDoc(docRef, formData);
            setLoading(false)
            toast.success('Listing edited', { autoClose: 1500 })
            // navigate(`/category${formData.type}/${docRef.id}`)
            navigate('/profile')
        } catch (error) {
            console.log(error);
            const errorCode = error.code;
            console.log('error嘅code：', errorCode); // auth/missing-email 
            toast.error(`Soemthing went wrong: ${errorCode.replace("auth/", "")}`)
        }
    }

    function onTypeChange(type) {
        setType(type)
    }
    function onNameChange(e) {
        setName(e.target.value)
    }
    function onBedroomsChange(e) {
        setBedrooms(Number(e.target.value))
    }
    function onBathroomsChange(e) {
        setBathrooms(Number(e.target.value))
    }
    function onParkingChange(isParking) {
        setParking(isParking)
    }
    function onFurnishChange(isFurnished) {
        setFurnish(isFurnished)
    }
    function onAddressChange(e) {
        setAddress(e.target.value)
    }
    function onLatitudeChange(e) {
        setLatitude(e.target.value)
    }
    function onLongitudeChange(e) {
        setLongitude(e.target.value)
    }
    function onDescriptionChange(e) {
        setDescription(e.target.value)
    }
    function onOfferChange(isOffer) {
        setOffer(isOffer)
    }
    function onRegularPriceChange(e) {
        setRegularPrice(Number(e.target.value))
    }
    function onDiscountedPriceChange(e) {
        setDiscountedPrice(Number(e.target.value))
    }
    function onImagesChange(e) {
        setImages(e.target.files)
    }

    if (loading) return <Spinner />
    return (
        <main className='max-w-md mx-auto pb-10'>
            <h1 className='text-center font-bold mt-6 text-3xl'>Edit a Listing</h1>
            <form onSubmit={onFormDataSubmit}>
                <div>
                    <p className='text-lg font-semibold mt-6'>Sale / Rent</p>
                    <div className='flex space-x-10'>
                        <CreateListingButton id='type' value={type} onClick={() => onTypeChange('sale')} className={type === "sale"
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"}>
                            Sale
                        </CreateListingButton>
                        <CreateListingButton id='type' value={type} onClick={() => onTypeChange('rent')} className={type === "rent"
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"}>
                            rent
                        </CreateListingButton>
                    </div>
                </div>
                <div>
                    <p className='text-lg font-semibold mt-6'>Name</p>
                    <input type='text' id='name' value={name} onChange={onNameChange} placeholder='Name'
                        maxLength='32' minLength='3' required
                        className='w-full rounded-lg lg:text-sm md:text-base sm:text-lg text-gray-700 border border-gray-300
                                focus:text-gray-700 focus:bg-white focus:border-slate-600
                                transition ease-in-out duration-200'/>
                </div>
                <div className='flex space-x-10'>
                    <div>
                        <p className='text-lg font-semibold mt-6'>Beds</p>
                        <input type='number' id='bedrooms' value={bedrooms} onChange={onBedroomsChange} min='1' max='50' required
                            className='text-center py-3 lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                                focus:text-gray-700 focus:bg-white focus:border-slate-600
                                transition ease-in-out duration-200'/>
                    </div>
                    <div>
                        <p className='text-lg font-semibold mt-6'>Baths</p>
                        <input type='number' id='bedrooms' value={bathrooms} onChange={onBathroomsChange} min='1' max='50' required
                            className='text-center py-3 lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                                focus:text-gray-700 focus:bg-white focus:border-slate-600
                                transition ease-in-out duration-200'/>
                    </div>
                </div>
                <div>
                    <p className='text-lg font-semibold mt-6'>Parking spot</p>
                    <div className='flex space-x-10'>
                        <CreateListingButton id='parking' value={true} onClick={() => onParkingChange(true)} className={parking === true
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"}>
                            Yes
                        </CreateListingButton>
                        <CreateListingButton id='parking' value={false} onClick={() => onParkingChange(false)} className={parking === false
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"}>
                            No
                        </CreateListingButton>
                    </div>
                </div>
                <div>
                    <p className='text-lg font-semibold mt-6'>Furnished</p>
                    <div className='flex space-x-10'>
                        <CreateListingButton id='furnish' value={furnish} onClick={() => onFurnishChange(true)} className={furnish === true
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"}>
                            Yes
                        </CreateListingButton>
                        <CreateListingButton id='furnish' value={furnish} onClick={() => onFurnishChange(false)} className={furnish === false
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"}>
                            No
                        </CreateListingButton>
                    </div>
                </div>
                <div>
                    <p className='text-lg font-semibold mt-6'>Address</p>
                    <textarea id='address' value={address} onChange={onAddressChange} placeholder='Your house address...' required rows='5'
                        className='w-full rounded-lg resize-none py-3 lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                         focus:text-gray-700 focus:bg-white focus:border-slate-600
                         transition ease-in-out duration-200'/>
                </div>
                {
                    !geolocationEnabled && <div className='flex space-x-10'>
                        <div>
                            <p className='text-lg font-semibold mt-6'>Latitude</p>
                            <input type='number' id='latitude' value={latitude} onChange={onLatitudeChange} min="-90"
                                max="90" required
                                className='text-center py-3 lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                                focus:text-gray-700 focus:bg-white focus:border-slate-600
                                transition ease-in-out duration-200'/>
                        </div>
                        <div>
                            <p className='text-lg font-semibold mt-6'>Longitude</p>
                            <input type='number' id='longitude' value={longitude} onChange={onLongitudeChange} min='-180' max='180' required
                                className='text-center py-3 lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                                focus:text-gray-700 focus:bg-white focus:border-slate-600
                                transition ease-in-out duration-200'/>
                        </div>
                    </div>
                }
                <div>
                    <p className='text-lg font-semibold mt-6'>Description</p>
                    <textarea id='description' value={description} onChange={onDescriptionChange} placeholder='Your house description...' required rows='5'
                        className='w-full rounded-lg resize-none py-3 lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                         focus:text-gray-700 focus:bg-white focus:border-slate-600
                         transition ease-in-out duration-200'/>
                </div>
                <div>
                    <p className='text-lg font-semibold mt-6'>Offer</p>
                    <div className='flex space-x-10'>
                        <CreateListingButton id='offer' value={offer} onClick={() => onOfferChange(true)} className={offer === true
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"}>
                            Yes
                        </CreateListingButton>
                        <CreateListingButton id='offer' value={offer} onClick={() => onOfferChange(false)} className={offer === false
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"}>
                            No
                        </CreateListingButton>
                    </div>
                </div>
                <div>
                    <p className='text-lg font-semibold mt-6'>Regular Price</p>
                    <div className='flex items-center'>
                        <input type='number' id='regularPrice' value={regularPrice} onChange={onRegularPriceChange} min="50" max="400000000" required
                            className='text-center py-3 rounded-lg lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                                focus:text-gray-700 focus:bg-white focus:border-slate-600
                                transition ease-in-out duration-200'/>
                        {/* 只有 type === rent 嘅時候，先有 $ / month（幾錢一個月）*/}
                        {type === 'rent' && <p className='ml-8 lg:text-sm md:text-base sm:text-lg whitespace-nowrap'>$ / month</p>}
                    </div>

                </div>
                {/* 只有 offer === true 嘅時候，先有 discount price*/}
                {offer === true && <div>
                    <p className='text-lg font-semibold mt-6'>Discounted Price</p>
                    <div className='flex items-center'>
                        <input type='number' id='discountedPrice' value={discountedPrice} onChange={onDiscountedPriceChange} min="50" max="400000000" required
                            className='text-center rounded-lg py-3 lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                                focus:text-gray-700 focus:bg-white focus:border-slate-600
                                transition ease-in-out duration-200'/>
                        <p className='ml-8 lg:text-sm md:text-base sm:text-lg whitespace-nowrap'>$ / month</p>
                    </div>
                </div>}
                <div>
                    <p className='text-lg font-semibold mt-6'>Images</p>
                    <p className='lg:text-sm md:text-base sm:text-lg text-red-500'>There are no more than 6 images.</p>
                    <input type='file' id='images' onChange={onImagesChange} accept='.jpg,.png,.jpeg' multiple required
                        className='text-gray-700 rounded-lg bg-white border border-gray-300 px-3 py-3 focus:text-gray-700 focus:bg-white focus:border-slate-600
                        transition ease-in-out duration-200'/>
                </div>
                <button
                    type='submit'
                    className='w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-7 py-3 mt-8 lg:text-sm md:text-base sm:text-lg font-medium uppercase rounded-lg hover:shadow-xl transition ease-in-out duration-500 mb-6'
                >
                    Edit Listing
                </button>
            </form>
        </main>
    )
}
