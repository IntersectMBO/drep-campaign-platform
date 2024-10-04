import React from 'react';

type DatabaseNullIconProps = {
  color?: string;
  width?: number;
  height?: number;
};

const DatabaseNullIcon = ({
  color = 'black',
  width = 24,
  height = 24,
}: DatabaseNullIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6C4 7.657 7.582 9 12 9C16.418 9 20 7.657 20 6M4 6C4 4.343 7.582 3 12 3C16.418 3 20 4.343 20 6M4 6V12M20 6V12M4 12C4 13.657 7.582 15 12 15C13.118 15 14.182 14.914 15.148 14.759M4 12V18C4 19.657 7.582 21 12 21C13.064 21 14.079 20.922 15.007 20.78M19 16V19M19 22V22.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DatabaseNullIcon;
