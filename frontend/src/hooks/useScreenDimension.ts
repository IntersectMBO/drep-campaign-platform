import { useEffect, useMemo, useState } from 'react';

export const useScreenDimension = () => {
  const [screenWidth, setScreenWidth] = useState<number>(1920);
  const [isMobile, setIsMobile] = useState<boolean>(
   false
  );
  const pagePadding = useMemo(() => {
    return screenWidth < 768
      ? 2
      : screenWidth < 1024
      ? 6
      : screenWidth < 1440
      ? 8
      : screenWidth < 1920
      ? 10
      : 37;
  }, [screenWidth]);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    setIsMobile(window.innerWidth < 768);

    function handleWindowSizeChange() {
      setScreenWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return {
    screenWidth,
    isMobile,
    pagePadding,
  };
};
