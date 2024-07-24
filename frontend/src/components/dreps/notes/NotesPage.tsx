'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SingleNote from './SingleNote';
import NotesPageHeader from './NotesPageHeader';
import { Skeleton } from '@mui/material';
import { useCardano } from '@/context/walletContext';
import { useDRepContext } from '@/context/drepContext';
import { useGetNotesQuery } from '@/hooks/useGetNotesQuery';
import InfiniteScroll from 'react-infinite-scroll-component';

const LoaderComponent = () => {
  return Array.from({ length: 4 }).map((_, index) => (
    <div
      className="flex flex-col gap-1 rounded-xl bg-white bg-opacity-70 p-5 shadow-md"
      key={index}
    >
      <Skeleton variant="text" width={150} />
      <Skeleton variant="text" height={100} />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </div>
  ));
};

function NotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { stakeKeyBech32, isEnabled } = useCardano();
  const { isLoggedIn } = useDRepContext();
  const [lastNoteID, setLastNoteID] = useState<number | undefined>(undefined);
  const [dominantNoteId, setDominantNoteId] = useState<number | undefined>(
    undefined,
  );
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const noteRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const { Notes, isNotesLoading, isNotesFetching, isPreviousData } =
    useGetNotesQuery({
      afterNote:lastNoteID,
    });

  useEffect(() => {
    if (Notes && !isPreviousData) {
      setAllNotes((prevNotes) => {
        // Create a Map to store unique notes, with note_id as the key
        const uniqueNotesMap = new Map(
          [...prevNotes, ...Notes].map((note) => [note.note_id, note]),
        );

        // Convert the Map values back to an array
        const uniqueNotes = Array.from(uniqueNotesMap.values());

        // Sort notes by note_id in descending order (assuming higher IDs are more recent)
        return uniqueNotes;
      });
      setHasMore(Notes.length > 0);
    }
  }, [Notes, isPreviousData]);

  useEffect(() => {
    const urlNote = searchParams.get('note');
    if (urlNote) {
      setLastNoteID(Number(urlNote));
    }
  }, []);

  const updateDominantNote = useCallback(() => {
    if (allNotes && allNotes.length > 0) {
      const windowHeight = window.innerHeight;
      let maxVisibleArea = 0;
      let dominantNote = allNotes[0];

      allNotes.forEach((note) => {
        const element = noteRefs.current[note.note_id];
        if (element) {
          const rect = element.getBoundingClientRect();
          const visibleHeight =
            Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
          if (visibleHeight > maxVisibleArea) {
            maxVisibleArea = visibleHeight;
            dominantNote = note;
          }
        }
      });

      if (dominantNote.note_id !== dominantNoteId) {
        setDominantNoteId(dominantNote.note_id);
        updateURL(dominantNote.note_id.toString());
      }
    }
  }, [allNotes, dominantNoteId]);

  useEffect(() => {
    if (allNotes && allNotes.length > 0) {
      const topMostNote = allNotes[0];
      if (!dominantNoteId) {
        setDominantNoteId(topMostNote.note_id);
        updateURL(topMostNote.note_id.toString());
      }
    }
  }, [allNotes, dominantNoteId]);

  const updateURL = (noteId?: string) => {
    const params = new URLSearchParams(searchParams);
    if (noteId) params.set('note', noteId);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const fetchMoreData = useCallback(() => {
    if (!isNotesFetching && !isPreviousData && hasMore) {
      if (allNotes && allNotes.length > 0) {
        const lastNote = allNotes[allNotes.length - 1];
        if (lastNote.note_id !== lastNoteID) {
          setLastNoteID(lastNote.note_id);
        }
      }
    }
  }, [isNotesFetching, isPreviousData, hasMore, allNotes, lastNoteID]);
  if (isNotesLoading) {
    // first render
    return (
      <div className="flex min-h-screen flex-col gap-5 bg-white bg-opacity-50 px-5 py-10">
        <NotesPageHeader />
        <LoaderComponent />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-5 bg-white bg-opacity-50 px-5 py-10">
      <NotesPageHeader />
      <InfiniteScroll
        onScroll={updateDominantNote}
        dataLength={allNotes.length}

        next={fetchMoreData}
        hasMore={hasMore}
        loader={<LoaderComponent />}
        endMessage={<p className="text-center">You've caught up!</p>}
        scrollThreshold="200px"
        className="flex flex-col gap-5 pt-5"
      >
        {Array.from(new Set(allNotes.map((note) => note.note_id))).map(
          (noteId) => {
            const note = allNotes.find((n) => n.note_id === noteId);
            return (
              <div
                key={noteId}
                className="w-full"
                ref={(el: any) => (noteRefs.current[noteId] = el)}
              >
                <SingleNote
                  note={note}
                  currentVoter={stakeKeyBech32}
                  isEnabled={isEnabled}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            );
          },
        )}
        {allNotes.length === 0 && !isNotesLoading && <p>No notes</p>}
      </InfiniteScroll>
    </div>
  );
}

export default NotesPage;
