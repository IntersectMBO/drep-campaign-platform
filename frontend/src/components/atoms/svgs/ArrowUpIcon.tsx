import React from 'react';

type ArrowUpIconProps = {
  color?: string;
  width?: number;
  height?: number;
};

const ArrowUpIcon = ({
  color = 'white',
  width = 24,
  height = 24,
}: ArrowUpIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5V19M12 5L16 9M12 5L8 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArrowUpIcon;
