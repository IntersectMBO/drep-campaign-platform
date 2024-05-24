import React from 'react';
import Button from '../atoms/Button';

const ViewDRepTableBtn = ({ handleClick }) => {
  return (
    <Button handleClick={handleClick}>
      <p>Explore DReps</p>
    </Button>
  );
};

export default ViewDRepTableBtn;
