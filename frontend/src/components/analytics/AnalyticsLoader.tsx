'use client';
import React, { useEffect } from 'react';

const AnalyticsLoader = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.usefathom.com/script.js';
    script.setAttribute('data-site', process.env.NEXT_PUBLIC_FATHOM_ENVIRONMENT_ID);
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default AnalyticsLoader;
