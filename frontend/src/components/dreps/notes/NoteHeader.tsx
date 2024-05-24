import NoteHeaderTitle from './NoteHeaderTitle';
import NoteHeaderInfo from './NoteHeaderInfo';

function NoteHeader() {
  return (
    <div className="flex min-h-screen flex-col gap-y-12 bg-white p-10">
      <NoteHeaderTitle />

      <NoteHeaderInfo />
    </div>
  );
}

export default NoteHeader;
