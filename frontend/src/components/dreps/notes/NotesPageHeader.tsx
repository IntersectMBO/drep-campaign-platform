import Button from '@/components/atoms/Button';
import { useScreenDimension } from '@/hooks';
import { useRouter } from 'next/navigation';

function NotesPageHeader() {
  const router = useRouter();
  const { isMobile } = useScreenDimension();
  function handleNavigate() {
    router.push('/dreps/workflow/notes/new');
  }

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-4xl font-black md:text-6xl">Notes</h2>

      <Button
        size="extraLarge"
        variant="outlined"
        width={!isMobile && '180px'}
        bgColor="transparent"
        color="primary"
        handleClick={handleNavigate}
      >
        {isMobile ? <img src="/svgs/plus.svg" alt="New" /> : 'New Note'}
      </Button>
    </div>
  );
}

export default NotesPageHeader;
