import React from 'react'

export default function CreateListingButton(props) {

    const { id, value, onClick, className, children } = props

    return (
        <button
            type='button'
            className={`w-6/12 py-2 font-medium lg:text-sm md:text-base sm:text-lg uppercase
                shadow-md hover:shadow-lg active:shadow-lg transition ease-in-out duration-200 rounded-lg ${className}`}
            id={id}
            value={value}
            onClick={onClick}>
            {children}
        </button>
    )
}
