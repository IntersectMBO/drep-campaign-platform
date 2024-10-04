import React from 'react';

const DotsLoader = ({ size = 35, shadowOffset = 60 }) => {
  const keyframesStyle = `
    @keyframes l5 {
      0%  {box-shadow: ${shadowOffset}px 0 white, -${shadowOffset}px 0 #4340ff; background: white; }
      33% {box-shadow: ${shadowOffset}px 0 white, -${shadowOffset}px 0 #4340ff; background: #4340ff;}
      66% {box-shadow: ${shadowOffset}px 0 #4340ff, -${shadowOffset}px 0 white; background: #4340ff;}
      100%{box-shadow: ${shadowOffset}px 0 #4340ff, -${shadowOffset}px 0 white; background: white; }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style>
      <div
        style={{
          width: `${size}px`,
          aspectRatio: 1,
          borderRadius: '50%',
          animation: 'l5 1s infinite linear alternate',
        }}
      ></div>
    </>
  );
};

export default DotsLoader;
