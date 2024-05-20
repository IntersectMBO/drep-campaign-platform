import React from 'react';
import { Button as MUIButton } from '@mui/material';
import './Atoms.css'; // Import the CSS file

export interface ButtonProps {
  size?: 'extraLarge' | 'large' | 'medium' | 'small';
  variant?: 'text' | 'outlined' | 'contained';
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  width?: number | string;
  bgColor?: string;
  borderRadius?: string;
  sx?: object;
  children?: React.ReactNode;
  handleClick?: (any) => any;
  type?: 'submit' | 'button';
}

const Button: React.FC<ButtonProps> = ({
  size = 'large',
  variant = 'contained',
  color = 'primary',
  width,
  bgColor,
  borderRadius,
  sx,
  children,
  handleClick,
  type = 'button',
  ...props
}) => {
  const buttonHeight = {
    extraLarge: 48,
    large: 40,
    medium: 36,
    small: 32,
  }[size];

  return (
    <MUIButton
      className={`rounded-3xl bg-blue-800 font-poppins capitalize ${size}`}
      style={{
        height: buttonHeight,
        width: width,
        backgroundColor: bgColor,
        borderRadius: borderRadius,
        ...sx,
      }}
      variant={variant}
      color={color}
      onClick={handleClick}
      type={type}
      {...props}
    >
      {children}
    </MUIButton>
  );
};

export default Button;
