import React, { useState } from 'react';
import TextEditOptions from '../molecules/TextEditOptions';
import { useCardano } from '@/context/walletContext';
import { Controller } from 'react-hook-form';
import { Typography } from '@mui/material';
import { marked } from 'marked';
import { processContent } from '@/lib/ContentProcessor/processContent';

type MarkdownEditorProps = {
  control: any;
  errors: any;
  name: string;
};

const MarkdownEditor = ({ control, errors, name }: MarkdownEditorProps) => {
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const { isEnabled } = useCardano();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const parts = processContent(field.value);
        return (
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between rounded-t-xl border-l border-r border-t bg-slate-50 py-1">
              <div className="flex">
                <div
                  className={`px-2 ${mode === 'write' ? 'opacity-100' : 'opacity-50'} cursor-pointer`}
                  onClick={() => setMode('write')}
                >
                  Write
                </div>
                <div
                  className={`px-2 ${mode === 'preview' ? 'opacity-100' : 'opacity-50'} cursor-pointer`}
                  onClick={() => setMode('preview')}
                >
                  Preview
                </div>
              </div>
              <div>
                <TextEditOptions
                  active={isEnabled}
                  setInitialMarkdown={(value) => {
                    if (typeof value === 'string') {
                      field.onChange(value);
                    } else if (typeof value === 'function') {
                      const newValue = value(field.value || '');
                      field.onChange(newValue);
                    }
                  }}
                />
              </div>
            </div>
            {mode === 'write' ? (
              <textarea
                className="min-h-40 w-full rounded-b-xl border p-2"
                {...field}
                placeholder="Write your note here..."
              />
            ) : (
              <div className="min-h-40 w-full overflow-auto rounded-b-xl border p-2">
                {parts && parts.map((item, index) => {
                  if (typeof item === 'string') {
                    return (
                      <Typography
                        key={index}
                        dangerouslySetInnerHTML={{ __html: marked.parse(item) }}
                      />
                    );
                  } else if (React.isValidElement(item)) {
                    return React.cloneElement(item, { key: index });
                  }
                  return null;
                })}
              </div>
            )}
            {errors[name] && (
              <span className="text-red-500 text-sm">{errors[name].message}</span>
            )}
          </div>
        );
      }}
    />
  );
};

export default MarkdownEditor;
