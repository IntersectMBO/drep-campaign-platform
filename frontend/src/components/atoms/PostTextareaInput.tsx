import React, { FC, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  sandpackPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  toolbarPlugin,
  markdownShortcutPlugin,
  DiffSourceToggleWrapper,
  UndoRedo,
  BoldItalicUnderlineToggles,
  InsertTable,
  ButtonOrDropdownButton,
  StrikeThroughSupSubToggles,
} from '@mdxeditor/editor';

import '@mdxeditor/editor/style.css';
import { Controller } from 'react-hook-form';
import { useCardano } from '@/context/walletContext';
import OverlayForm from '../molecules/OverlayForm';

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
  onChange: (value: string) => void;
  isEnabled?: boolean;
  label?: string;
}

const actionCard = ({ icon, label }) => {
  return (
    <div
      className={`flex flex-row items-center justify-start gap-5 text-nowrap text-zinc-800`}
    >
      <img src={icon} alt="Icon" className="h-5 w-5" />
      <p>{label}</p>
    </div>
  );
};

const actions = [
  {
    value: 'image',
    label: actionCard({ icon: '/svgs/notesvgs/photo.svg', label: 'Add file' }),
  },
  {
    value: 'proposal',
    label: actionCard({
      icon: '/svgs/notesvgs/table.svg',
      label: 'Add proposal',
    }),
  },
  {
    label: actionCard({ icon: '/svgs/notesvgs/link.svg', label: 'Add link' }),
    value: 'link',
  },
];

const CustomToolbar: FC<{ editor: MDXEditorMethods }> = ({ editor }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const [activeForm, setActiveForm] = useState(null);
  useEffect(() => {
    if (showOverlay && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [showOverlay]);
  const handleChoose = (value: string) => {
    setShowOverlay(true);
    setActiveForm(value);
  };
  return (
    <>
      <div className="inline-flex w-full justify-between">
        <div className="inline-flex items-center">
          <BoldItalicUnderlineToggles />
          <StrikeThroughSupSubToggles />
        </div>
        <div>
          <ButtonOrDropdownButton
            children={
              <img
                src="/svgs/paperclip.svg"
                ref={dropdownRef}
                alt="expand"
                className={`h-5 w-5 transform transition-transform `}
              />
            }
            title={'Add Attachment'}
            onChoose={handleChoose}
            items={[...actions]}
          />
        </div>
      </div>
      {showOverlay &&
        ReactDOM.createPortal(
          <div
            style={{
              position: 'absolute',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 9999,
            }}
          >
            <OverlayForm
              activeForm={activeForm}
              onClose={() => {
                setShowOverlay(false);
                setActiveForm(null);
              }}
              editor={editor}
            />
          </div>,
          document.body,
        )}
    </>
  );
};

const Editor: FC<EditorProps> = ({
  markdown,
  editorRef,
  onChange,
  isEnabled,
  label,
}) => {
  return (
    <div className="relative flex flex-col items-start justify-center">
      <label>{label}</label>
      <div className="flex min-h-40 w-full items-center justify-center rounded-bl-xl rounded-br-xl border-b border-l border-r border-zinc-100">
        <MDXEditor
          onChange={(content) => onChange(content)}
          ref={editorRef}
          markdown={markdown}
          contentEditableClassName="prose w-full min-h-40"
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            imagePlugin(),
            tablePlugin(),
            codeBlockPlugin(),
            sandpackPlugin(),
            codeMirrorPlugin(),
            diffSourcePlugin({
              readOnlyDiff: true,
            }),
            frontmatterPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <CustomToolbar editor={editorRef?.current} />
              ),
            }),
            markdownShortcutPlugin(),
          ]}
          readOnly={!isEnabled}
        />
      </div>
    </div>
  );
};
const PostTextareaInput = ({
  control,
  errors,
  name = 'postText',
  label = 'Write your note',
}) => {
  const { isEnabled } = useCardano();
  const editorRef = React.useRef<MDXEditorMethods>(null);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Editor
            markdown={value}
            editorRef={editorRef}
            isEnabled={isEnabled}
            onChange={onChange}
            label={label}
          />
        )}
      />
      <div className="text-sm text-red-700" data-testid="error-msg">
        {errors?.postText && errors?.postText?.message}
      </div>
    </>
  );
};

export default PostTextareaInput;
