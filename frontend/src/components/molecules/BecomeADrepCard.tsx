import {useCardano} from '@/context/walletContext';
import React from 'react';

const BecomeADrepCard = () => {
    const {isEnabled} = useCardano();
    return (
        <div className="my-8 flex justify-center text-zinc-100">
            <img
                src="/img/becomeDrepImg.png"
                alt="Handholdingcardanocoin"
                width={'210px'}
            />
        </div>
    );
};

export default BecomeADrepCard;
