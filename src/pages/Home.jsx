import React, { useEffect, useState } from 'react'
import Slider from '../components/Slider'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

export default function Home() {

  const [rentListings, setRentListings] = useState(null)
  const [saleListings, setSaleListings] = useState(null)
  const [recentListings, setRecentListings] = useState(null)

  function getQueryType(type) {
    switch (type) {
      case 'rent':
        return query(collection(db, 'listings'), where('type', '==', 'rent'), orderBy('timestamp', 'desc'), limit(4))
      case 'sale':
        return query(collection(db, 'listings'), where('type', '==', 'sale'), orderBy('timestamp', 'desc'), limit(4))
      default:
        return query(collection(db, 'listings'), where('offer', '==', true), orderBy('timestamp', 'desc'), limit(4))
    }
  }

  function saveListings(snapshot, type) {
    switch (type) {
      case 'rent':
        const rentListings = []
        snapshot.forEach(doc => {
          rentListings.push({ id: doc.id, data: doc.data() })
        });
        setRentListings(rentListings)
        break;
      case 'sale':
        const saleListings = []
        snapshot.forEach(doc => {
          saleListings.push({ id: doc.id, data: doc.data() })
        });
        setSaleListings(saleListings)
        break;
      default:
        const recentListings = []
        snapshot.forEach(doc => {
          recentListings.push({ id: doc.id, data: doc.data() })
        });
        setRecentListings(recentListings)
        break;
    }
  }

  useEffect(() => {
    async function fetchListings() {
      const rentQuery = getQueryType('rent')
      const saleQuery = getQueryType('sale')
      const recentQuery = getQueryType('recent')
      try {
        const rentQuerySnapshot = await getDocs(rentQuery)
        const saleQuerySnapshot = await getDocs(saleQuery)
        const recentQuerySnapshot = await getDocs(recentQuery)
        saveListings(recentQuerySnapshot, 'recent')
        saveListings(rentQuerySnapshot, 'rent')
        saveListings(saleQuerySnapshot, 'sale')
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings()
  }, [])



  return (
    <div>
      <Slider />
      <div className='max-w-6xl mx-auto pb-10 mb-20'>
        <div className='mt-10'>
          <h2 className='ml-2 text-2xl font-semibold'>Recent offers</h2>
          <Link to='/offers' className='ml-2 text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out'>
            Show more offers
          </Link>
          <ul className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {recentListings && recentListings.length>0 && (
              recentListings.map(item=><ListingItem key={item.id} item={item.data} id={item.id}/>)
            )}
          </ul>
        </div>
        <div className='mt-10'>
          <h2 className='ml-2 text-2xl font-semibold'>Sale offers</h2>
          <Link to='/category/sale' className='ml-2 text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out'>
            Show more offers
          </Link>
          <ul className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {saleListings && saleListings.length>0 && (
              saleListings.map(item=><ListingItem key={item.id} item={item.data} id={item.id}/>)
            )}
          </ul>
        </div>
        <div className='mt-10'>
          <h2 className='ml-2 text-2xl font-semibold'>Rent offers</h2>
          <Link to='/category/rent' className='ml-2 text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out'>
            Show more offers
          </Link>
          <ul className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {rentListings && rentListings.length>0 && (
              rentListings.map(item=><ListingItem key={item.id} item={item.data} id={item.id}/>)
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
