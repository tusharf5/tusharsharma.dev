import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import light from 'prism-react-renderer/themes/github';
import dark from 'prism-react-renderer/themes/vsDark';
import useDarkMode from 'use-dark-mode';

const RE = /{([\d,-]+)}/;

const calculateLinesToHighlight = (meta) => {
  if (!RE.test(meta)) {
    return () => false;
  } else {
    const lineNumbers = RE.exec(meta)[1]
      .split(',')
      .map((v) => v.split('-').map((v) => parseInt(v, 10)));
    return (index) => {
      const lineNumber = index + 1;
      const inRange = lineNumbers.some(([start, end]) =>
        end ? lineNumber >= start && lineNumber <= end : lineNumber === start
      );
      return inRange;
    };
  }
};

export const CodeSnippet = ({ codeString, language, metastring, render, ...props }) => {
  const shouldHighlightLine = calculateLinesToHighlight(metastring);
  const darkMode = useDarkMode(false);

  if (!codeString) {
    console.log({ props });
    return props.children;
  }

  if (props.live) {
    return (
      <LiveProvider code={codeString}>
        <LiveEditor />
        <LiveError />
        <LivePreview />
      </LiveProvider>
    );
  }

  if (render) {
    return (
      <div>
        <LiveProvider code={codeString}>
          <LivePreview />
        </LiveProvider>
      </div>
    );
  }

  console.log(codeString);

  return (
    <Highlight {...defaultProps} code={codeString} language={language} theme={darkMode.value ? dark : light}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line, key: i });
            if (shouldHighlightLine(i)) {
              lineProps.className = `${lineProps.className} highlight-line`;
            }
            return (
              <div {...lineProps}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};
