import React from 'react'

const DrepInfoCard = ({img, title, description}) => {
  return (
    <div className='flex flex-col items-start justify-center bg-drep-info-bg-color shadow-lg rounded-lg p-5 w-[286px] h-[269px]'>
      <img src={img} alt={title} width={"60px"} className='mb-3'/>
      <p className='text-lg mb-3 font-extrabold'>{title}</p>
      <p className='text-sm font-extralight'>{description}</p>
    </div>
  )
}

export default DrepInfoCard