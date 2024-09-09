import React from 'react';

type ArrowDownIconProps = {
  color?: string;
  width?: number;
  height?: number;
};

const ArrowDownIcon = ({
  color = 'white',
  width = 24,
  height = 24,
}: ArrowDownIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5V19M12 19L16 15M12 19L8 15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArrowDownIcon;
