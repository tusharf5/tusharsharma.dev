/* eslint-disable */
import React, { useEffect } from "react";
import { graphql } from "gatsby";
import { nanoid } from "nanoid";

import Layout from "../components/layout";
import Seo from "../components/seo";
import PostCard from "../components/post-card";
import Header from "../components/header";

const IndexPage = ({ data }) => {
  const { edges: posts } = data.allMdx;

  return (
    <Layout>
      <Seo />
      <Header />
      <main className="index">
        <ul>
          {posts.map(({ node: post }) => (
            <li key={post.id}>
              <PostCard article={post} />
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  query blogIndex {
    allMdx(
      filter: { frontmatter: { draft: { ne: true } } }
      sort: { fields: [fields___date], order: DESC }
    ) {
      edges {
        node {
          id
          timeToRead
          frontmatter {
            title
            excerpt
            tags
            category
          }
          fields {
            slug
            date
          }
        }
      }
    }
  }
`;
