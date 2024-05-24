import { useState } from 'react';
import { motion } from 'framer-motion';

interface HoverLinkChipProps {
  children?: React.ReactNode;
  link?: string;
  handleClick?: () => void;
  position?: 'top' | 'bottom';
}
const HoverLinkChip = ({
  children,
  link,
  handleClick,
  position = 'top',
}: HoverLinkChipProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex w-full items-center justify-center"
      onClick={handleClick}
    >
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 flex flex-col rounded-md bg-zinc-800 p-2 text-sm text-white shadow-md"
          style={{
            top: `${position === 'top' ? '-40px' : '40px'}`,
            transform: 'translateX(-50%)',
            width: 'fit-content',
          }}
        >
          <div className="flex w-full flex-row">
            <img src="/note/link.svg" alt="" />
            <a
              href={link}
              target="_blank"
              className="text-sm text-blue-300 underline"
            >
              {link}
            </a>
          </div>
          <div
            className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 transform bg-zinc-800 ${position === 'bottom' ? '-top-1' : '-bottom-1'}`}
          ></div>
        </motion.div>
      )}

      <div
        className="w-fit cursor-pointer"
        onClick={() => setIsHovered((prev) => !prev)}
      >
        {children}
      </div>
    </div>
  );
};
export default HoverLinkChip;
