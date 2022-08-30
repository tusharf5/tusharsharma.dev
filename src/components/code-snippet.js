import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import rangeParser from 'parse-numeric-range';

import dark from 'prism-react-renderer/themes/vsDark';

const RE = /{([\d,-]+)}/;

const calculateLinesToHighlight = (meta) => {
  if (RE.test(meta)) {
    const strlineNumbers = RE.exec(meta)[1];
    const lineNumbers = rangeParser(strlineNumbers);
    return (index) => lineNumbers.includes(index + 1);
  } else {
    return () => false;
  }
};

function empty() {}

export const CodeSnippet = ({ children, className, metastring }) => {
  const shouldHighlightLine = metastring ? calculateLinesToHighlight(metastring) : empty;

  if (!children) {
    return '';
  }

  const language = className ? className.replace(/language-/, '') : '';

  if (!language) {
    return <code>{children}</code>;
  }

  return (
    <Highlight {...defaultProps} code={children} language={language} theme={dark}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line, key: i });
            if (shouldHighlightLine(i)) {
              lineProps.className = `${lineProps.className} highlight-line`;
            }
            return (
              <div key={i} {...lineProps}>
                {line.map((token, key) => {
                  if (token.empty) {
                    return null;
                  }
                  return <span key={key} {...getTokenProps({ token, key })} />;
                })}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};
