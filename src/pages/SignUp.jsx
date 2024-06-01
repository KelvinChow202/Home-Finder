import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-toastify';

export default function SignUp() {

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const { fullName, email, password } = formData

  const auth = getAuth()
  const navigate = useNavigate()

  function onChangeFormData(e) {
    setFormData(prevFormData => ({
      ...prevFormData,
      [e.target.id]: e.target.value
    }))
  }

  async function onSubmitFormData(e) {
    e.preventDefault()
    // Register 一個新 account
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      // displayName 預設為 null，因為 displayName 並不是在註冊時必須提供的屬性
      // 如果想要在註冊時設置 displayName，需要在註冊成功後，使用 updateProfile 方法來更新用戶配置文件
      await updateProfile(user, { displayName: fullName })
      const formDataCopy = { ...formData }
      delete formDataCopy.password
      formDataCopy['timestamp'] = serverTimestamp()
      // 將 user 放入數據庫
      await setDoc(doc(db, 'users', user.uid), formDataCopy)
      navigate('/')
      toast.success(`Hi ${fullName}`, { autoClose: 500 })
    } catch (error) {
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('error嘅code：', errorCode); // auth/missing-email 
      console.log('error嘅message：', errorMessage); // Firebase: Error (auth/missing-email)
      toast.error(`Soemthing went wrong with the registration: ${errorCode.replace("auth/", "")}`)
    }

  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
      <div className='flex flex-wrap justify-center items-center max-w-6xl mx-auto py-12'>
        <div className='md:w-[67%] lg:w-[50%] sm:mb-12 md:mb-6'>
          <img src='https://plus.unsplash.com/premium_photo-1663089688180-444ff0066e5d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt='key' className='w-full rounded-2xl' />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmitFormData} className='mb-6'>
            <input
              type='text'
              id='fullName'
              value={fullName}
              onChange={onChangeFormData}
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 border-gray-300 rounded-lg transition ease-in-out'
              placeholder='Full name' />
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
                Have an account?
                <Link
                  to='/sign-in'
                  className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1'>
                  Sign in
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
              className='w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-7 py-3 lg:text-sm md:text-base sm:text-lg font-medium uppercase rounded-lg hover:shadow-xl transition ease-in-out duration-500 mb-6'
            >
              Sign Up
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
