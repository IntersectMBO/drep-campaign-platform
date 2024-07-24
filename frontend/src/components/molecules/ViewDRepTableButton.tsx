import React from 'react';
import Button from '../atoms/Button';

type ViewDRepTableBtnProps = {
  handleClick?: () => void;
  size?:
    | 'extraLarge'
    | 'large'
    | 'medium'
    | 'small'
    | 'extraSmall'
    | 'smallest';
};
const ViewDRepTableBtn = ({ handleClick, size }: ViewDRepTableBtnProps) => {
  return (
    <Button size={size} handleClick={handleClick}>
      <p>Explore DReps</p>
    </Button>
  );
};

export default ViewDRepTableBtn;
