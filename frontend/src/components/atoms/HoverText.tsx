import { Grow, Typography } from '@mui/material';
import React, { useState } from 'react';

const HoverText = ({ shortText, longText }) => {
  const [hover, setHover] = useState(false);
  const isSameNumber = Number(shortText) === Number(longText);

  if (isSameNumber) {
    return (
      <div className="w-full cursor-default">
        <Typography className="inline-block w-auto px-1">
          ₳ {shortText}
        </Typography>
      </div>
    );
  }

  return (
    <div
      className="w-full cursor-default"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {!!hover && (
        <Grow in={hover}>
          <Typography className="inline-block w-auto rounded bg-gray-50 px-1">
            ₳ {longText}
          </Typography>
        </Grow>
      )}
      {!hover && (
        <Typography className="inline-block w-auto px-1">
          ₳ {shortText}
        </Typography>
      )}
    </div>
  );
};

export default HoverText;
