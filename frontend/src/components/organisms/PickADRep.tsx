'use client'
import React from 'react'
import ViewDRepTableBtn from '../molecules/ViewDRepTableButton'
import { useRouter } from 'next/navigation'
import { useDRepContext } from '@/context/drepContext'
const PickADRep = () => {
  const {setActiveTab}=useDRepContext()
  const router=useRouter()
  const navtoDRepList=()=>{
    setActiveTab('/dreps/list')
    router.push('/dreps/list')
  }
  
  return (
    <div className='grid grid-cols-2 gap-4 p-10 shadow-lg z-10'>
      <div className='col-span-1 flex flex-col items-start justify-center gap-3 p-20'>
        <div className='font-bold text-6xl'>
        <p>How can I</p>
        <p>pick a DRep</p>
        </div>
        
        <p>In order to participate in governance, a stake credential must be delegated to a DRep. Ada holders will generally delegate their voting rights to a registered DRep that will vote on their behalf.</p>
        <ViewDRepTableBtn handleClick={navtoDRepList}/>
      </div>
      <div className='col-span-1 flex flex-col items-center justify-center'>
        <img src="/img/handscuppingcoin.png" alt="Pick a DRep img" width={"500px"} />
      </div>
    </div>
  )
}

export default PickADRep