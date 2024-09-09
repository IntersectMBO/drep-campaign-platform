import React from 'react';

type ArrowRightIconProps = {
  color?: string;
  width?: number;
  height?: number;
};

const ArrowRightIcon = ({
  color = 'white',
  width = 24,
  height = 24,
}: ArrowRightIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19M19 12L15 16M19 12L15 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArrowRightIcon;
