import React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { classList } from "dynamic-class-list";

// types is neutral, danger, warning, success, primary

const NoteBox = ({ type = "neutral" }) => {
  return (
    <div
      style={{
        height: 0,
        width: 0,
      }}
      className={classList("post-note-box", type)}
    />
  );
};

export default NoteBox;
