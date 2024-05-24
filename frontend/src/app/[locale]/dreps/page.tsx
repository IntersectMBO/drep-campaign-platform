'use client';
import {Background} from '@/components/atoms/Background';
import DRepInfo from '@/components/organisms/DRepInfo';
import DRepIntro from '@/components/organisms/DRepIntro';
import GovernanceActionsCard from '@/components/organisms/GovernanceActionsCard';
import PickADRep from '@/components/organisms/PickADRep';
import {useDRepContext} from '@/context/drepContext';
import React, {useEffect} from 'react';

const page = ({params: {locale}}) => {
    const {setCurrentLocale} = useDRepContext();
    useEffect(() => {
        setCurrentLocale(locale);
    }, []);
    return (
        <Background>
            <DRepIntro />

            <DRepInfo/>

            <section>
                <PickADRep/>
            </section>

            <section>
                <GovernanceActionsCard/>
            </section>
        </Background>
    );
};

export default page;
