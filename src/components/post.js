import React, { useEffect } from 'react';
import { graphql } from 'gatsby';

import Seo from './seo';
import Layout from './layout';
import Header from './header';
import PostFooter from './post-footer';

const Post = ({ data: { mdx }, pageContext: { id, next, prev }, children }) => {
  useEffect(() => {
    if (typeof window.twttr !== 'undefined') {
      try {
        window.twttr.widgets.load();
      } catch {}
    }
  }, []);
  return (
    <Layout>
      <Seo
        scripts={[]}
        title={mdx.frontmatter.title}
        description={mdx.frontmatter.excerpt}
        keywords={[...mdx.frontmatter.tags, mdx.frontmatter.category]}
      />
      <Header />
      <main className="blog-article">
        <article className="markdown-body">
          <h1>{mdx.frontmatter.title}</h1>
          {children}
        </article>
      </main>
      <PostFooter postId={mdx.frontmatter.uid} url={mdx.fields.slug} title={mdx.frontmatter.title} />
    </Layout>
  );
};

export default Post;

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      id
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
