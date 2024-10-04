import React from 'react';

type ChevronsLeftIconProps = {
  color?: string;
  width?: number;
  height?: number;
};

const ChevronsLeftIcon = ({
  color = 'white',
  width = 24,
  height = 24,
}: ChevronsLeftIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 7L6 12L11 17M17 7L12 12L17 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChevronsLeftIcon;
