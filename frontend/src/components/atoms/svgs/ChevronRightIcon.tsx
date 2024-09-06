import React from 'react';

type ChevronRightIconProps = {
  color?: string;
  width?: number;
  height?: number;
};
const ChevronRightIcon = ({
  color = 'white',
  width = 24,
  height = 24,
}: ChevronRightIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 6L15 12L9 18"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default ChevronRightIcon;
