import React from 'react';
import { Link } from 'gatsby';

export default function PostCard({ article }) {
  const { fields, frontmatter } = article;
  return (
    <div className='post-snippet'>
      <h2>
        <Link to={fields.slug}>{frontmatter.title}</Link>
      </h2>
      <p>{frontmatter.excerpt}</p>
      <Link className='readmore' to={fields.slug}>
        Read more <span>→</span>
      </Link>
    </div>
  );
}
