'use client'
import SetupProgressBar from '@/components/atoms/SetupProgressBar'
import UpdateProfile from '@/components/organisms/UpdateProfile'
import React from 'react'

const page = () => {
  return (
    <div className='form_container bg-white py-10 px-5'>
        <div className='w-full flex flex-col gap-2 items-center justify-center'>
        <SetupProgressBar/>
        <UpdateProfile/>
        </div>
    </div>
  )
}

export default page