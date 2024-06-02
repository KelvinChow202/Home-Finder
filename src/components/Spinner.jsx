import React from 'react'
import PacmanLoader from 'react-spinners/PacmanLoader';

export default function Spinner() {
    
  return (
    <div className='flex items-center justify-center min-h-screen'>
        <PacmanLoader color="#36d7b7" size={100}/>
    </div>
  )
}
