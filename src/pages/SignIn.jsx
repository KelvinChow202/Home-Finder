import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

export default function SignIn() {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { email, password } = formData
  const auth = getAuth()
  const navigate = useNavigate()

  function onChangeFormData(e) {
    setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.id]: e.target.value
    }))
  }

  async function onFormDataSubmit(e) {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      navigate('/')
      toast.success(`Hi ${user.displayName}`, { autoClose: 500 })
    } catch (error) {
      console.log(error);
      const errorCode = error.code;
      console.log('error嘅code：', errorCode); // auth/missing-email 
      toast.error(`Soemthing went wrong: ${errorCode.replace("auth/", "")}`)
    }
  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1>
      <div className='flex flex-wrap justify-center items-center max-w-6xl mx-auto py-12'>
        <div className='md:w-[67%] lg:w-[50%] sm:mb-12 md:mb-6'>
          <img src='https://plus.unsplash.com/premium_photo-1663089688180-444ff0066e5d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='key' className='w-full rounded-2xl' />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onFormDataSubmit} className='mb-6'>
            <input
              type='email'
              id='email'
              value={email}
              onChange={onChangeFormData}
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 border-gray-300 rounded-lg transition ease-in-out'
              placeholder='Email address' />
            <input
              type='password'
              id='password'
              value={password}
              onChange={onChangeFormData}
              className='w-full px-4 py-2 text-xl text-gray-700 border-gray-300 rounded-lg transition ease-in-out'
              placeholder='Password' />
            <div className='flex justify-between lg:text-sm md:text-base sm:text-lg whitespace-nowrap mb-6 mt-3'>
              <p>
                Don't have an account?
                <Link
                  to='/sign-up'
                  className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1'>
                  Register
                </Link>
              </p>
              <Link
                to='/forgot-password'
                className='text-blue-600 hover:text-blue-800 transition ease-in-out duration-200'>
                Forgot password?
              </Link>
            </div>
            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white lg:text-sm md:text-base sm:text-lg px-7 py-3 font-medium uppercase rounded-lg hover:shadow-xl transition ease-in-out duration-500 mb-6'
            >
              Sign In
            </button>
            <div
              className='
              flex items-center
              before:border-t before:flex-1 before:border-gray-300
              after:border-t after:flex-1 after:border-gray-300
              mb-6
            '
            >
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  )
}
