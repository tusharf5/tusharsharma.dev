import React, { useEffect, useRef } from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import mediumZoom from "medium-zoom";

import Seo from "./seo";
import Layout from "./layout";
import Header from "./header";
import PostFooter from "./post-footer";

const Post = ({ data: { mdx }, pageContext: { id, next, prev } }) => {
  const body = useRef(null);

  useEffect(() => {
    const zoom = mediumZoom();
    const bodyNode = body.current;
    zoom.attach([...bodyNode.querySelectorAll("img")]);
    return () => {
      zoom.detach([...bodyNode.querySelectorAll("img")]);
    };
  }, []);
  return (
    <Layout>
      <Seo
        title={mdx.frontmatter.title}
        description={mdx.frontmatter.excerpt}
        keywords={[...mdx.frontmatter.tags, mdx.frontmatter.category]}
      />
      <Header />
      <main className="blog-article">
        <article ref={body} className="markdown-body">
          <h1>{mdx.frontmatter.title}</h1>
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </article>
      </main>
      <PostFooter id={mdx.frontmatter.uid} url={mdx.fields.slug} title={mdx.frontmatter.title} />
    </Layout>
  );
};

export default Post;

export const query = graphql`
  query postBySlug($id: String!) {
    mdx(id: { eq: $id }) {
      id
      body
      timeToRead
      frontmatter {
        title
        tags
        category
        excerpt
      }
      fields {
        date
        slug
      }
    }
  }
`;
