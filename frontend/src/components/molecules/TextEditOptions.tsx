import { Editor } from '@tiptap/react';
import React, { useEffect, useState } from 'react';
import MultipartDataForm from './MultipartDataForm';
import { set } from 'cypress/types/lodash';
type TextEditOptionsProps = {
  editor: Editor;
  active: boolean;
};

const TextEditOptions: React.FC<TextEditOptionsProps> = ({
  editor,
  active,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [imagePayload, setImagePayload] = useState(null);
  const [linkPayload, setLinkPayload] = useState(null);
  const resetState = () => {
    setShowOverlay(false);
    setActiveForm(null);
  };
  useEffect(() => {
    if (imagePayload) {
      if (imagePayload.length > 1) {
        imagePayload.forEach((image) => {
          editor.chain().focus().setImage({ src: image }).run();
        });
        setImagePayload(null);
      } else {
        editor.chain().focus().setImage({ src: imagePayload[0] }).run();
        setImagePayload(null);
      }
      resetState();
    }
    if (linkPayload) {
      if (linkPayload.length > 1) {
        linkPayload.forEach((link) => {
          const linkTag = ` <a href=${link.url}>${link.title}</a> `;
          editor.chain().focus().insertContent(linkTag).run();
        });
        setLinkPayload(null);
      } else {
        const linkTag = ` <a href=${linkPayload[0].url}>${linkPayload[0].title}</a> `;
        editor.chain().focus().insertContent(linkTag).run();
        setLinkPayload(null);
      }
      resetState();
    }
  }, [imagePayload, linkPayload]);
  const handleFormatText = (format) => {
    //active maps to isEnabled
    if (!active) return;
    switch (format) {
      case 'table':
        if (editor.isActive('table')) {
          editor.chain().focus().deleteTable().run();
        } else {
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
        }
        break;
      case 'heading':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'image':
        setShowOverlay((prev) => !prev);
        setActiveForm((prev) => (prev === 'image' ? null : 'image'));
        break;
      case 'link':
        setShowOverlay((prev) => !prev);
        setActiveForm((prev) => (prev === 'link' ? null : 'link'));
        break;
      default:
        editor.commands[
          `toggle${format.charAt(0).toUpperCase() + format.slice(1)}`
        ]();
        break;
    }
  };

  return (
    <div
      id="toolbar-container"
      className="flex h-9 w-[80%] items-center justify-start gap-3 bg-slate-50 px-2"
    >
      <div
        className={`${active ? 'cursor-pointer' : 'pointer-events-none'} ${
          editor.isActive('bold') ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => handleFormatText('bold')}
      >
        <img src="/note/bold.svg" alt="Bold img" />
      </div>
      <div
        className={`${active ? 'cursor-pointer' : 'pointer-events-none'} ${
          editor.isActive('italic') ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => handleFormatText('italic')}
      >
        <img src="/note/italic.svg" alt="Italic img" />
      </div>
      <div
        className={`${active ? 'cursor-pointer' : 'pointer-events-none'} ${
          editor.isActive('strike') ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => handleFormatText('strike')}
      >
        <img src="/note/strikethrough.svg" alt="Strikethru" />
      </div>
      <div
        className={`${active ? 'cursor-pointer' : 'pointer-events-none'} ${
          editor.isActive('code') ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => handleFormatText('code')}
      >
        <img src="/note/code.svg" alt="Code" />
      </div>
      <div
        className={`${active ? 'cursor-pointer' : 'pointer-events-none'} ${
          editor.isActive('superscript') ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => handleFormatText('superscript')}
      >
        <img src="/note/superscript.svg" alt="Superscrpt" />
      </div>

      <div
        className={`${active ? 'cursor-pointer' : 'pointer-events-none'} ${
          editor.isActive('highlight') ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => handleFormatText('highlight')}
      >
        <img src="/note/highlight.svg" alt="Highlight" />
      </div>
      <div
        className={`${active ? 'cursor-pointer' : 'pointer-events-none'} ${
          editor.isActive('heading') ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => handleFormatText('heading')}
      >
        <img src="/note/heading.svg" alt="Heading" />
      </div>
      <div
        className={`${active ? 'cursor-pointer' : 'pointer-events-none'} ${
          editor.isActive('bulletList') ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => handleFormatText('bulletList')}
      >
        <img src="/note/list.svg" alt="List" />
      </div>
      <div
        className={`${active ? 'cursor-pointer' : 'pointer-events-none'} ${
          editor.isActive('orderedList') ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => handleFormatText('orderedList')}
      >
        <img src="/note/list-numbers.svg" alt="Listnums" />
      </div>
      <div
        className={`${active ? 'cursor-pointer' : 'pointer-events-none'} ${
          editor.isActive('Blockquote') ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => handleFormatText('blockquote')}
      >
        <img src="/note/quote.svg" alt="Quote" />
      </div>
      <div
        className={`${active ? 'cursor-pointer' : 'pointer-events-none'} ${
          editor.isActive('codeBlock') ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => handleFormatText('codeBlock')}
      >
        <img src="/note/source-code.svg" alt="Srccode" />
      </div>
      <div
        className={`${active ? 'cursor-pointer' : 'pointer-events-none'}`}
        onClick={() => handleFormatText('table')}
      >
        <img src="/note/table.svg" alt="table" />
      </div>
      <div className={`relative flex h-full flex-col`}>
        <div
          className={`flex h-full flex-row items-center justify-center gap-5 text-nowrap rounded-lg ${activeForm === 'image' ? 'bg-white' : 'bg-violet-50'} px-3 text-zinc-800 ${active ? 'cursor-pointer' : 'pointer-events-none'}`}
          onClick={() => handleFormatText('image')}
        >
          <img
            src="/note/photo.svg"
            alt="Image"
            className={`${activeForm === 'image' ? 'opacity-100' : 'opacity-50'}`}
          />
          <p>Add Image</p>
        </div>
        {showOverlay && activeForm === 'image' && (
          <MultipartDataForm
            activeForm={'image'}
            nullify={resetState}
            setImagePayload={setImagePayload}
          />
        )}
      </div>
      <div className={`relative flex h-full flex-col`}>
        <div
          className={`flex h-full flex-row items-center justify-center gap-5 text-nowrap rounded-lg ${activeForm === 'link' ? 'bg-white' : 'bg-violet-50'} px-3 text-zinc-800 ${active ? 'cursor-pointer' : 'pointer-events-none'}`}
          onClick={() => handleFormatText('link')}
        >
          <img
            src="/note/link.svg"
            alt="Link"
            className={`${activeForm === 'link' ? 'opacity-100' : 'opacity-50'}`}
          />
          <p>Add Link</p>
        </div>
        {showOverlay && activeForm === 'link' && (
          <MultipartDataForm
            activeForm={'link'}
            nullify={resetState}
            setLinkPayload={setLinkPayload}
          />
        )}
      </div>
    </div>
  );
};

export default TextEditOptions;
