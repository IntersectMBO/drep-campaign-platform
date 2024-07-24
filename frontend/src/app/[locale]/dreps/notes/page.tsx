'use client';
import NotesPage from '@/components/dreps/notes/NotesPage';
import { Suspense } from 'react';

function Notes() {
  return (
    <div className="base_container">
      <Suspense fallback={null}>
        <NotesPage />
      </Suspense>
    </div>
  );
}

export default Notes;
