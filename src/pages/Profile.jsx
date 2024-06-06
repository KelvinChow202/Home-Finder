import { getAuth, updateProfile } from 'firebase/auth'
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { db } from '../firebase'
import { toast } from 'react-toastify'
import { FcHome } from "react-icons/fc"
import { Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

export default function Profile() {

  const auth = getAuth()
  const currentUser = auth.currentUser
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: currentUser.displayName,
    email: currentUser.email
  })
  const { name, email } = formData

  const [isChangedDetail, setIsChangedDetail] = useState(false)
  const [listsings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getListings() {
      const collectionRef = collection(db, 'listings')
      const q = query(collectionRef, where('userRef', '==', currentUser.uid), orderBy('timestamp', 'desc'))
      const querySnapshot = await getDocs(q)
      let listings = []
      querySnapshot.forEach(snapShot => {
        listings.push({
          id: snapShot.id,
          data: snapShot.data()
        })
      })
      setListings(listings)
      setLoading(false)
      // console.log(listings);
    }
    getListings()
  }, [currentUser.uid])

  function onFormDataChange(e) {
    setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.id]: e.target.value
    }))
  }

  async function onEdit() {
    setIsChangedDetail(prevState => !prevState)
    if (isChangedDetail) {
      const docRef = doc(db, 'users', currentUser.uid)
      try {
        await updateProfile(currentUser, { displayName: name })
        await updateDoc(docRef, {
          fullName: name
        })
        toast.success('Edit successfully', { autoClose: 1000 })
      } catch (error) {
        toast.error('Edit failed')
      }
    }
  }

  function onLogout() {
    auth.signOut()
    navigate('/')
  }

  function onEditList(listingId) {
    navigate(`/edit-listing/${listingId}`)
  }

  async function onDelList(listingId) {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        await deleteDoc(doc(db, "listings", listingId))
        const newListings = listsings.filter(item => item.id !== listingId)
        setListings(newListings)
      } catch (error) {
        toast.error('Deleted failed')
      }
    }
  }

  return (
    <>
      <section className='flex justify-center items-center flex-col max-w-6xl mx-auto'>
        <h1 className='text-3xl text-center font-bold mt-6'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3 '>
          <form className='space-y-10'>
            <input type='text' value={name} id='name' onChange={onFormDataChange} disabled={!isChangedDetail}
              className={`w-full px-4 py-3 border border-gray-300  ${isChangedDetail ? 'bg-red-200' : 'bg-white'} text-gray-700 text-xl rounded-lg transition ease-in-out`}
            />
            <input type='text' value={email} id='email' onChange={onFormDataChange} disabled
              className='w-full px-4 py-3 border border-gray-300 bg-white text-gray-700 text-xl rounded-lg transition ease-in-out'
            />
            <div className='flex justify-between whitespace-nowrap'>
              <p className='lg:text-sm md:text-base sm:text-lg'>
                Do you wnat to change your name?
                <span
                  onClick={onEdit}
                  className='cursor-pointer ml-1 text-red-600 hover:text-red-700 transition ease-in-out duration-200'>
                  {isChangedDetail ? 'Apply your change' : 'Edit'}
                </span>
              </p>
              <p onClick={onLogout} className='cursor-pointer lg:text-sm md:text-base sm:text-lg text-blue-600 hover:text-blue-800 transition ease-in-out duration-200'>
                Sign out
              </p>
            </div>
          </form>
          <button
            type='submit'
            className='w-full py-5 lg:text-sm md:text-base sm:text-lg bg-blue-600 text-white rounded-lg uppercase font-medium shadow-md hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 transition ease-in-out duration-150'>
            <Link to='/create-listing' className='flex justify-center items-center'>
              <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2' />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className='max-w-6xl mx-auto mt-6 mb-20'>
        {!loading && listsings.length > 0 && (
          <>
            <h1 className='text-2xl text-center font-semibold'>My Listings</h1>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
              {listsings.map(item => <ListingItem key={item.id} item={item.data} id={item.id} onEditList={onEditList} onDelList={onDelList} />)}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
