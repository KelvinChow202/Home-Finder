import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment';
import { IoLocationSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";


export default function ListingItem(props) {
    const { item, id, onEditList, onDelList } = props
    const { type, imageUrls, timestamp, address, name, discountedPrice, regularPrice, bedrooms, bathrooms } = item

    return (
        <li className='relative pb-2 m-[10px] bg-white shadow-md hover:shadow-lg 
        overflow-hidden transition duration-200 ease-in-out lg:text-sm md:text-base sm:text-lg'>
            <Link to={`/category/${item.type}/${id}`} className='contents'>
                <img src={imageUrls[0]} alt='House pic' loading='lazy'
                    className='h-[170px] w-full object-cover hover:scale-105 transition duration-200 ease-in-out' />
                <Moment fromNow
                    className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase  font-semibold rounded-md shadow-lg px-2 py-1'>
                    {timestamp && timestamp.toDate()}
                </Moment>
                <div className='pl-1'>
                    <div className='w-full flex items-center space-x-1 mt-1'>
                        <IoLocationSharp className='h-4 w-4 text-green-600' />
                        <p className='font-semibold text-gray-600 truncate max-w-[calc(100%-2rem)]'>{address}</p>
                    </div>
                    <p className='font-semibold mt-1 text-xl truncate'>{name}</p>
                    <p className='text-[#457b9d] font-semibold mt-1'>$ {item.offer ? discountedPrice.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : regularPrice.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {type === 'rent' && ' / month'}
                    </p>
                    <div className='flex items-center space-x-3 mt-1'>
                        <p className='font-bold text-xs'>{bedrooms > 1 ? `${bedrooms} Beds` : '1 Bed'}</p>
                        <p className='font-bold text-xs'>{bathrooms > 1 ? `${bathrooms} Baths` : '1 Bath'}</p>
                    </div>
                </div>
            </Link>
            {
                onEditList && <MdEdit onClick={() => onEditList(id)}
                    className='absolute right-8 bottom-2 cursor-pointer' />
            }
            {
                onDelList && <FaTrash onClick={() => onDelList(id)}
                    className='absolute right-2 bottom-2 cursor-pointer text-red-500' />
            }
        </li>
    )
}
