'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const AnalyticsLoader = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Loading Fathom Analytics script instance for every page change, but only if it's not already loaded.
    if (!document.querySelector('script[src="https://cdn.usefathom.com/script.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.usefathom.com/script.js';
      script.setAttribute('data-site', process.env.NEXT_PUBLIC_FATHOM_ENVIRONMENT_ID);
      script.defer = true;
      
      document.body.appendChild(script);
      
      script.onerror = () => {
        console.error('Failed to load Fathom Analytics script');
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [pathname]);

  return null;
};

export default AnalyticsLoader;
