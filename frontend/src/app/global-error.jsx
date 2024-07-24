'use client';

import Error from 'next/error';
import { useEffect } from 'react';

export default function GlobalError({ error }) {
  useEffect(() => {
    //@todo
    // Capture and report the error as soon as the component mounts or the error changes.
  }, [error]);

  return (
    <html>
      <body>
        {/* Render the Next.js Error component to display a generic error page to the user. */}
        <Error />
      </body>
    </html>
  );
}
