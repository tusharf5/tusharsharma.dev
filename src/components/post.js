import React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";

import Seo from "./seo";
import Layout from "./layout";
import Header from "./header";
import PostFooter from "./post-footer";

const Post = ({ data: { mdx }, pageContext: { id, next, prev } }) => {
  return (
    <Layout>
      <Seo
        scripts={["https://platform.twitter.com/widgets.js"]}
        title={mdx.frontmatter.title}
        description={mdx.frontmatter.excerpt}
        keywords={[...mdx.frontmatter.tags, mdx.frontmatter.category]}
      />
      <Header />
      <main className="blog-article">
        <article className="markdown-body">
          <h1>{mdx.frontmatter.title}</h1>
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </article>
      </main>
      <PostFooter
        postId={mdx.frontmatter.uid}
        url={mdx.fields.slug}
        title={mdx.frontmatter.title}
      />
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
        uid
      }
      fields {
        date
        slug
      }
    }
  }
`;
