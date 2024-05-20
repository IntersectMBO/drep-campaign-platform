import React from 'react';
import Button from '../atoms/Button';

const ViewDraftsButton = () => {
  return (
    <Button
      variant="outlined"
      bgColor="transparent"
      data-testid="view-drafts-button"
      borderRadius="43px"
      width={'139px'}
      size="extraLarge"
    >
      <p className="text-center text-sm font-medium leading-4 text-blue-800">
        View Drafts
      </p>
    </Button>
  );
};

export default ViewDraftsButton;
