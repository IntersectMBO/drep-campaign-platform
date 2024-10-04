import { Background } from '@/components/atoms/Background';
import React from 'react';

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Background>
        <div className="loader"></div>
      </Background>
    </div>
  );
};

export default Loading;
