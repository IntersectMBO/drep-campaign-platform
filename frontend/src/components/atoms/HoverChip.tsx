import { useState } from 'react';
import { motion } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';
interface HoverChipProps {
  icon?: string;
  text?: string;
  handleClick?: () => void;
  position?: 'top' | 'bottom';
  textToCopy?: string;
}
const HoverChip = ({
  icon,
  text,
  handleClick,
  position = 'top',
  textToCopy,
}: HoverChipProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative z-50 flex items-center justify-center"
      onClick={handleClick}
    >
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 flex max-w-44 flex-col text-wrap rounded-md bg-zinc-800 p-2 text-sm text-white shadow-md"
          style={{
            top: `${position === 'top' ? '-55px' : '35px'}`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className='text-wrap'>{text}</div>
          {textToCopy && (
            <div className="w-full cursor-pointer break-words">
              {textToCopy}
              <CopyToClipboard
                text={textToCopy}
                onCopy={() => {
                  console.log('copied!');
                }}
                className="clipboard-text cursor-pointer"
              >
                <img src="/copy.svg" alt="copy" />
              </CopyToClipboard>
            </div>
          )}

          <div
            className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 transform bg-zinc-800 ${position === 'bottom' ? '-top-1' : '-bottom-1'}`}
          ></div>
        </motion.div>
      )}

      <img
        src={icon}
        alt="Icon"
        className="h-6 w-6 cursor-pointer"
        onClick={() => setIsHovered((prev) => !prev)}
      />
    </div>
  );
};
export default HoverChip;
