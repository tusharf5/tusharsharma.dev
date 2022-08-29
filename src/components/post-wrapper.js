/* eslint react/prop-types: 0 */
/* eslint react/display-name: 0  */
import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { CodeSnippet } from './code-snippet';
import { preToCodeBlock } from 'mdx-utils';

import NoteBox from './short-codes/NoteBox';

// components is its own object outside of render so that the references to
// components are stable
const components = {
  pre: (preProps) => {
    const props = preToCodeBlock(preProps);
    console.log(preProps);
    // if there's a codeString and some props, we passed the test
    if (props) {
      return <CodeSnippet {...props} />;
    }
    // it's possible to have a pre without a code in it
    return <pre {...preProps} />;
  },
  code: CodeSnippet,
  NoteBox: NoteBox,
};

export const wrapRootElement = ({ element }) => <MDXProvider components={components}>{element}</MDXProvider>;
