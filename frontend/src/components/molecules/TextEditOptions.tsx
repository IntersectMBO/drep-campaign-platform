import { Editor } from '@tiptap/react';
import * as ReactDOM from 'react-dom';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import OverlayForm from './OverlayForm';
import { useScreenDimension } from '@/hooks';

type DropDownActionsProps = {
  active: boolean;
  activeForm: string;
  handleFormatText: (text: string) => void;
  isMobile: boolean;
};

const DropDownActions = ({
  setIsOpen,
  isOpen,
  isMobile,
}: DropDownActionsProps & {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}) => {
  return (
    <div className="relative text-nowrap">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer bg-white shadow-sm rounded-xl px-2 py-1"
      >
        <div id="drop-down-actions" className="flex items-center gap-1 ">
          <div>
            {isMobile ? (
              <img
                src="/svgs/paperclip.svg"
                alt="Add Attachment"
                className={`h-5 w-5`}
              />
            ) : (
              <p>Add Attachment</p>
            )}
          </div>
          <div>
            <img
              src="/svgs/chevron-down.svg"
              alt="expand"
              className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type TextEditOptionsProps = {
  active: boolean;
  editor?: Editor;
  setInitialMarkdown?: Dispatch<SetStateAction<string>>;
};

const TextEditOptions: React.FC<TextEditOptionsProps> = ({
  active,
  editor,
  setInitialMarkdown,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [imagePayload, setImagePayload] = useState(null);
  const [linkPayload, setLinkPayload] = useState(null);
  const [proposalHashPayload, setProposalHashPayload] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const { isMobile } = useScreenDimension();
  const dropdownRef = useRef(null);

  const actions = [
    {
      name: 'Add file',
      icon: '/svgs/notesvgs/photo.svg',
      action: 'image',
    },
    {
      name: 'Add proposal',
      icon: '/svgs/notesvgs/table.svg',
      action: 'proposal',
    },
    {
      name: 'Add link',
      icon: '/svgs/notesvgs/link.svg',
      action: 'link',
    },
  ];
  const insertMarkdown = (markdown: string) => {
    setInitialMarkdown((prevMarkdown) => prevMarkdown + markdown);
  };

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);
  const resetState = () => {
    setShowOverlay(false);
    setActiveForm(null);
  };
  useEffect(() => {
    if (imagePayload) {
      if (imagePayload.length > 1) {
        imagePayload.forEach((file) => {
          insertMarkdown(file.markdown);
        });
      } else {
        insertMarkdown(imagePayload[0].markdown);
      }
      setImagePayload(null);
      resetState();
    }
    if (linkPayload) {
      if (linkPayload.length > 1) {
        linkPayload.forEach((link) => {
          insertMarkdown(link.markdown);
        });
      } else {
        insertMarkdown(linkPayload[0].markdown);
      }
      setLinkPayload(null);
      resetState();
    }
    if (proposalHashPayload) {
      if (proposalHashPayload.length > 1) {
        proposalHashPayload.forEach((markdown) => {
          insertMarkdown(markdown);
        });
      } else {
        insertMarkdown(proposalHashPayload[0]);
      }
      setProposalHashPayload(null);
      resetState();
    }
  }, [imagePayload, linkPayload, proposalHashPayload]);

  const handleFormatText = (format) => {
    //active maps to isEnabled
    if (!active) return;
    switch (format) {
      case 'image':
        setShowOverlay((prev) => !prev);
        setActiveForm((prev) => (prev === 'image' ? null : 'image'));
        break;
      case 'link':
        setShowOverlay((prev) => !prev);
        setActiveForm((prev) => (prev === 'link' ? null : 'link'));
        break;
      case 'proposal':
        setShowOverlay((prev) => !prev);
        setActiveForm((prev) => (prev === 'proposal' ? null : 'proposal'));
        break;
      case 'bold':
        insertMarkdown('**Bold Text**');
        break;
      case 'italic':
        insertMarkdown('*Italic Text*');
        break;
      default:
        console.log('Unknown command', format);
        break;
    }
  };

  return (
    <>
      <div
        id="toolbar-container"
        className="flex max-h-10 w-full items-center justify-start gap-3 overflow-x-auto bg-slate-50 px-2"
      >
        <div
          className={`${active ? 'cursor-pointer' : 'pointer-events-none'} shrink-0 `}
          onClick={() => handleFormatText('bold')}
        >
          <img src="/svgs/notesvgs/bold.svg" alt="Bold img" />
        </div>
        <div
          className={`${active ? 'cursor-pointer' : 'pointer-events-none'} $ shrink-0`}
          onClick={() => handleFormatText('italic')}
        >
          <img src="/svgs/notesvgs/italic.svg" alt="Italic img" />
        </div>

        <div ref={dropdownRef}>
          <DropDownActions
            active={active}
            activeForm={activeForm}
            handleFormatText={handleFormatText}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            isMobile={isMobile}
          />
        </div>
        {showOverlay &&
          ReactDOM.createPortal(
            <div
              className={`
              z-50 w-fit
              ${
                isMobile
                  ? 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                  : 'absolute'
              }
            `}
              style={{
                ...(isMobile
                  ? {}
                  : {
                      top: `${dropdownPosition.top}px`,
                      left: `${dropdownPosition.left}px`,
                    }),
              }}
            >
              <OverlayForm
                activeForm={activeForm}
                onClose={() => {
                  setShowOverlay(false);
                  setActiveForm(null);
                }}
                setImagePayload={setImagePayload}
                setLinkPayload={setLinkPayload}
                setProposalHashPayload={setProposalHashPayload}
              />
            </div>,
            document.body,
          )}
      </div>
      {isOpen &&
        ReactDOM.createPortal(
          <div
            style={{
              position: 'absolute',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 9999,
            }}
          >
            <div className="overflow-hidden rounded-lg bg-white shadow-lg">
              {actions.map((action, index) => (
                <div
                  key={index}
                  className={`flex flex-row items-center justify-start gap-5 text-nowrap px-3 py-2 text-zinc-800 ${active ? 'cursor-pointer hover:bg-gray-100' : 'pointer-events-none opacity-50'}`}
                  onClick={() => {
                    handleFormatText(action.action);
                    setIsOpen(false);
                  }}
                >
                  <img src={action.icon} alt="Icon" className="h-5 w-5" />
                  <p>{action.name}</p>
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default TextEditOptions;
