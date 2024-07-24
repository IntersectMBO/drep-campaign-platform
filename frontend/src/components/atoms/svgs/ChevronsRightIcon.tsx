import React from 'react';

type ChevronsRightIconProps = {
  color?: string;
  width?: number;
  height?: number;
};

const ChevronsRightIcon = ({
  color = 'white',
  width = 24,
  height = 24,
}: ChevronsRightIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 7L12 12L7 17M13 7L18 12L13 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChevronsRightIcon;
