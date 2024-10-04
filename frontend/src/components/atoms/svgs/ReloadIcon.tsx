import React from 'react';

type ReloadIconProps = {
  color?: string;
  width?: number;
  height?: number;
};

const ReloadIcon = ({
  color = 'white',
  width = 24,
  height = 24,
}: ReloadIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.933 13.0412C19.7442 14.4811 19.1669 15.8425 18.2632 16.9793C17.3594 18.1162 16.1633 18.9855 14.803 19.4942C13.4427 20.0029 11.9696 20.1317 10.5417 19.8667C9.11374 19.6018 7.78486 18.9532 6.69755 17.9905C5.61024 17.0277 4.80551 15.7872 4.36967 14.4018C3.93383 13.0165 3.88332 11.5386 4.22355 10.1268C4.56379 8.71488 5.28194 7.42227 6.30097 6.38752C7.32001 5.35278 8.6015 4.61495 10.008 4.25317C13.907 3.25317 17.943 5.26017 19.433 9.00017M20 4.00015V9.00015H15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ReloadIcon;
