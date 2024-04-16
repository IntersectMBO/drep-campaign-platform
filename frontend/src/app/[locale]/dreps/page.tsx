'use client'
import DRepInfo from '@/components/organisms/DRepInfo'
import DRepIntro from '@/components/organisms/DRepIntro'
import GovernanceActionsCard from '@/components/organisms/GovernanceActionsCard'
import PickADRep from '@/components/organisms/PickADRep'
import React, {useState} from 'react'

const page = () => {
    
    return (
        <div className={'container'}>
            <DRepIntro/>
            <DRepInfo/>
            <PickADRep/>
            <GovernanceActionsCard/>
        </div>
    )
}

export default page