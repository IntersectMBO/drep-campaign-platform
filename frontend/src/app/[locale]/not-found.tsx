'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

function NotFound() {
  const pathname = usePathname();
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center gap-4 text-black">
        <p className="text-4xl font-bold">Oops!</p>
        <div className="flex items-center">
          <h1 className="mr-6 border-r border-black pr-6 text-2xl font-semibold">
            404
          </h1>
          <h2 className="text-base font-medium">
            This Page could not be found.
          </h2>
        </div>
        <p className="rounded bg-primary-100 px-2 py-1 text-base font-medium">
          URL: {pathname}
        </p>
      </div>
    </div>
  );
}

export default NotFound;
