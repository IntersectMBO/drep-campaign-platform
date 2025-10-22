import React from 'react';
import { Button as MUIButton } from '@mui/material';
import './Atoms.css'; // Import the CSS file

export interface ButtonProps {
  size?:
    | 'extraLarge'
    | 'large'
    | 'medium'
    | 'small'
    | 'extraSmall'
    | 'smallest';
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
  bgcolor?: string;
  id?: string;
  disabled?: boolean;
  borderRadius?: string;
  sx?: object;
  children?: React.ReactNode;
  handleClick?: (any) => any;
  type?: 'submit' | 'button';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  size = 'large',
  variant = 'contained',
  color = 'primary',
  id,
  width,
  bgcolor,
  disabled,
  borderRadius,
  sx,
  children,
  handleClick,
  type = 'button',
  className,
  ...props
}) => {
  const buttonHeight = {
    extraLarge: 48,
    large: 40,
    medium: 36,
    small: 32,
    extraSmall: 30,
    smallest: 26,
  }[size];

  return (
    <MUIButton
      className={`${className}`}
      style={{
        height: buttonHeight,
        width: width,
        backgroundColor: bgcolor,
        borderRadius: borderRadius,
        ...sx,
      }}
      id={id}
      disabled={disabled}
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
