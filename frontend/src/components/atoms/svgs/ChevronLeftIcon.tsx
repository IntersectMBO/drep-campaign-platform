import React from 'react';

type ChevronLeftIconProps = {
  color?: string;
  width?: number;
  height?: number;
};

const ChevronLeftIcon = ({
  color = 'white',
  width = 24,
  height = 24,
}: ChevronLeftIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 6L9 12L15 18"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default ChevronLeftIcon;
