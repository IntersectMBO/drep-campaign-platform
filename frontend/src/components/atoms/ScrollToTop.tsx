import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (!header) return;
      const scrollPosition = window.scrollY;
      const headerBottom = header.offsetTop + header.offsetHeight;
      setIsVisible(scrollPosition > headerBottom);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`fixed bottom-5 left-1/2 flex max-w-8 cursor-pointer items-center justify-center rounded-full bg-white p-2 shadow-lg ${
        isVisible ? 'block' : 'hidden'
      }`}
      onClick={scrollToTop}
    >
      <img src="/up-arrow.svg" alt="Up" />
    </div>
  );
};

export default ScrollToTop;
