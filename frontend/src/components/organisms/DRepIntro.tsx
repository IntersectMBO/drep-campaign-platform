import React from 'react'
import DRepIntroText from '../molecules/DRepIntroText'
import DRepIntroImgs from '../molecules/DRepIntroImgs'

const DRepIntro = () => {
  return (
    <div className='grid grid-cols-2 gap-4 mb-3'>
    <div className='col-span-1'>
      <DRepIntroText/>
    </div>
    <div className='col-span-1'>
      <DRepIntroImgs/>
    </div>
  </div>
  
  )
}

export default DRepIntro