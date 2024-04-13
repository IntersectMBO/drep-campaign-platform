'use client'
import {useCardano} from '@/context/walletContext'
import React, {useState} from 'react'

const page = () => {
    const {isEnabled} = useCardano()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const connectWallet = () => {
        try {
            setIsModalOpen(true)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className={'container'}>
            Homepage
        </div>
    )
}

export default page