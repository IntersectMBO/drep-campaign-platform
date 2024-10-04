import React from 'react';
import * as marked from 'marked';

const DisplayParsedContent = ({ content }) => {
  return (
    <div>
      {content.map((item, index) => {
        if (typeof item === 'string') {
          return (
            <p
              className="parsed-content w-full break-words"
              key={index}
              dangerouslySetInnerHTML={{ __html: marked.parse(item) }}
            ></p>
          );
        } else if (React.isValidElement(item)) {
          return React.cloneElement(item, { key: index });
        }
        return "";
      })}
    </div>
  );
};

export default DisplayParsedContent;
