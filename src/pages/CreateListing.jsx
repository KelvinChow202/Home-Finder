import React, { useState } from 'react'
import CreateListingButton from '../components/CreateListingButton'

export default function CreateListing() {

    const [formData, setFormData] = useState({
        type: 'rent',
        name: 'Jasmine',
        bedrooms: 1,
        bathrooms: 1,
        parking: true,
        furnish: true,
        address: '',
        description: '',
        offer: true,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {}
    })
    const { type, name, bedrooms, bathrooms, parking, furnish, address, description, offer, regularPrice,
        discountedPrice, latitude, longitude, images } = formData
    const sellClass = type === 'sell' ? "bg-white text-black" : "bg-slate-600 text-white"
    const rentClass = type === 'rent' ? "bg-white text-black" : "bg-slate-600 text-white"

    function getYesOrNoClass(value) {
        return value ? "bg-white text-black" : "bg-slate-600 text-white";
    }
    const hasParkingClass = getYesOrNoClass(parking === true);
    const noParkingClass = getYesOrNoClass(parking === false);
    const hasFurnishClass = getYesOrNoClass(furnish === true);
    const noFurnishClass = getYesOrNoClass(furnish === false);
    const hasOfferClass = getYesOrNoClass(offer === true);
    const noOfferClass = getYesOrNoClass(offer === false);



    function onFormDataChange() { }

    return (
        <main className='bg-orange-500 max-w-md mx-auto pb-10'>
            <h1 className='text-center font-bold mt-6 text-3xl'>Create a Listing</h1>
            <form>
                <div>
                    <p className='text-lg font-semibold mt-6'>Sell / Rent</p>
                    <div className='flex space-x-10'>
                        <CreateListingButton id='type' value={type} onClick={onFormDataChange} className={sellClass}>
                            sell
                        </CreateListingButton>
                        <CreateListingButton id='type' value={type} onClick={onFormDataChange} className={rentClass}>
                            rent
                        </CreateListingButton>
                    </div>
                </div>

                <div>
                    <p className='text-lg font-semibold mt-6'>Name</p>
                    <input type='text' id='name' value={name} onChange={onFormDataChange} placeholder='Name'
                        maxLength='32' minLength='10' required
                        className='w-full rounded-lg lg:text-sm md:text-base sm:text-lg text-gray-700 border border-gray-300
                                focus:text-gray-700 focus:bg-white focus:border-slate-600
                                transition ease-in-out duration-200'/>
                </div>
                <div className='flex space-x-10'>
                    <div>
                        <p className='text-lg font-semibold mt-6'>Beds</p>
                        <input type='number' id='bedrooms' value={bedrooms} onChange={onFormDataChange} min='1' max='50' required
                            className='text-center py-3 lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                                focus:text-gray-700 focus:bg-white focus:border-slate-600
                                transition ease-in-out duration-200'/>
                    </div>
                    <div>
                        <p className='text-lg font-semibold mt-6'>Baths</p>
                        <input type='number' id='bedrooms' value={bathrooms} onChange={onFormDataChange} min='1' max='50' required
                            className='text-center py-3 lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                                focus:text-gray-700 focus:bg-white focus:border-slate-600
                                transition ease-in-out duration-200'/>
                    </div>
                </div>
                <div>
                    <p className='text-lg font-semibold mt-6'>Parking spot</p>
                    <div className='flex space-x-10'>
                        <CreateListingButton id='parking' value={true} onClick={onFormDataChange} className={hasParkingClass}>
                            Yes
                        </CreateListingButton>
                        <CreateListingButton id='parking' value={false} onClick={onFormDataChange} className={noParkingClass}>
                            No
                        </CreateListingButton>
                    </div>
                </div>
                <div>
                    <p className='text-lg font-semibold mt-6'>Furnished</p>
                    <div className='flex space-x-10'>
                        <CreateListingButton id='furnish' value={furnish} onClick={onFormDataChange} className={hasFurnishClass}>
                            Yes
                        </CreateListingButton>
                        <CreateListingButton id='furnish' value={furnish} onClick={onFormDataChange} className={noFurnishClass}>
                            No
                        </CreateListingButton>
                    </div>
                </div>
                <div>
                    <p className='text-lg font-semibold mt-6'>Address</p>
                    <textarea id='address' value={address} onChange={onFormDataChange} placeholder='Your house address...' required rows='5'
                        className='w-full rounded-lg resize-none py-3 lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                         focus:text-gray-700 focus:bg-white focus:border-slate-600
                         transition ease-in-out duration-200'/>
                </div>
                <div>
                    <p className='text-lg font-semibold mt-6'>Description</p>
                    <textarea id='description' value={description} onChange={onFormDataChange} placeholder='Your house description...' required rows='5'
                        className='w-full rounded-lg resize-none py-3 lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                         focus:text-gray-700 focus:bg-white focus:border-slate-600
                         transition ease-in-out duration-200'/>
                </div>
                <div>
                    <p className='text-lg font-semibold mt-6'>Offer</p>
                    <div className='flex space-x-10'>
                        <CreateListingButton id='offer' value={offer} onClick={onFormDataChange} className={hasOfferClass}>
                            Yes
                        </CreateListingButton>
                        <CreateListingButton id='offer' value={offer} onClick={onFormDataChange} className={noOfferClass}>
                            No
                        </CreateListingButton>
                    </div>
                </div>
                <div>
                    <p className='text-lg font-semibold mt-6'>Regular Price</p>
                    <div className='flex items-center'>
                        <input type='number' id='regularPrice' value={regularPrice} onChange={onFormDataChange} min="50" max="400000000" required
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
                    <input type='number' id='discountedPrice' value={discountedPrice} onChange={onFormDataChange} min="50" max="400000000" required
                        className='text-center rounded-lg py-3 lg:text-sm md:text-base sm:text-lg text-gray-700 bg-white border border-gray-300
                                focus:text-gray-700 focus:bg-white focus:border-slate-600
                                transition ease-in-out duration-200'/>
                </div>}
                <div>
                    <p className='text-lg font-semibold mt-6'>Images</p>
                    <p className='lg:text-sm md:text-base sm:text-lg text-red-500'>The first image will be the cover (max 6).</p>
                    <input type='file' id='images' onChange={onFormDataChange} accept='.jpg,.png,.jpeg' multiple required
                        className='text-gray-700 rounded-lg bg-white border border-gray-300 px-3 py-3 focus:text-gray-700 focus:bg-white focus:border-slate-600
                        transition ease-in-out duration-200'/>
                </div>
                <button
                    type='submit'
                    className='w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-7 py-3 mt-8 lg:text-sm md:text-base sm:text-lg font-medium uppercase rounded-lg hover:shadow-xl transition ease-in-out duration-500 mb-6'
                >
                    Create Listing
                </button>
            </form>
        </main>
    )
}
