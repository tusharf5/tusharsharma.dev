const path = require('path');
const kebabCase = require('lodash.kebabcase');
const { createFilePath } = require('gatsby-source-filesystem');

// thanks to https://gist.github.com/jzazove/1479763
const urlify = function (a) {
  return a
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '-')
    .replace(/^-+|-+$/g, '');
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: { fs: 'empty' },
  });
};
// called for each node that has been created
// good place to add/modify nodes that you care about usig in your app
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx') {
    /** { id, parent, frontmatter, internal: { type } } = node */

    // 1. MDX Plugin creates special nodes for each .mdx file with a Type `Mdx`
    // 2. The parent of each such node is the same file but with a type `File`
    // 3. That is because each file can have multiple types of children transformed into a special type
    // 4. createFilePath first finds out the Parent `File` node of this special `Mdx` type node.
    // 5. Then it returns the path of that `File` node with an optional trailing slash w.r.t to the path you provided in config
    // 6. These files/directories are placed in the `path` that you provided to the `gatsby-source-filesystem`
    // 7. Example 1 -  hello-world/index.mdx -> `/hello-world`
    // 8. Example 2 -  hello-world/john.mdx -> `/hello-world/john`
    // 9. Example 2 -  john.mdx -> `/john`
    // 10. Example 2 -  index.mdx -> `/`
    const dirName = createFilePath({
      node,
      getNode,
      trailingSlash: false,
    }); // this will have a starting '/' slash
    // dirName is name of the blog directory i.e 2019-02-09

    const date = dirName.slice(1); // removing the starting '/' slash
    // createNodeField creates an additional field on the node that you can query in your graphql
    // { node: { fields: { slug: 'value' } } }
    const slug = urlify(node.frontmatter.uid);
    createNodeField({
      name: 'slug',
      node,
      value: `/posts/${slug}`,
    });
    createNodeField({
      name: 'date',
      node,
      value: date,
    });
    createNodeField({
      name: 'category',
      node,
      value: node.frontmatter.category.toLowerCase(),
    });
    createNodeField({
      name: 'tags',
      node,
      value: node.frontmatter.tags.map((tag) => tag.toLowerCase()),
    });
  }
};

// called for creating additional pages if defined in it
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMdx {
              edges {
                node {
                  id
                  body
                  frontmatter {
                    category
                    title
                    tags
                    draft
                  }
                  fields {
                    slug
                    date
                  }
                  internal {
                    contentFilePath
                  }
                }
              }
            }
          }
        `
      ).then((result) => {
        // this is some boilerlate to handle errors
        if (result.errors) {
          console.error(result.errors);
          reject(result.errors);
        }

        // will store tag/category names as keys and the
        // value will be the total number of times
        // that tag/category is use in all of the nodes
        // { js: 4, git: 3 }
        const tags = {};
        const categories = {};

        // all the posts except draft = true
        const posts = result.data.allMdx.edges
          .filter(({ node }) => !node.frontmatter.draft)
          .sort(function (a, b) {
            return new Date(a.node.fields.date) - new Date(b.node.fields.date);
          });

        posts.forEach(({ node }, index) => {
          const category = node.frontmatter.category.toLowerCase();
          if (categories[category]) {
            categories[category] = categories[category] + 1;
          } else {
            categories[category] = 1;
          }
          node.frontmatter.tags.forEach((tag) => {
            const tagValue = tag.toLowerCase();
            if (tags[tagValue]) {
              tags[tagValue] = tags[tagValue] + 1;
            } else {
              tags[tagValue] = 1;
            }
          });

          const next = posts[index + 1]
            ? {
                path: posts[index + 1].node.fields.slug,
                title: posts[index + 1].node.frontmatter.title,
              }
            : null;
          const prev = posts[index - 1]
            ? {
                path: posts[index - 1].node.fields.slug,
                title: posts[index - 1].node.frontmatter.title,
              }
            : null;

          // create a page for this node/post
          createPage({
            path: node.fields.slug,
            component: `${path.resolve(__dirname, `src/components/post.js`)}?__contentFilePath=${
              node.internal.contentFilePath
            }`,
            context: {
              id: node.id,
              next,
              prev,
            },
          });
        });

        // create a page for all the posts
        createPage({
          path: '/posts',
          component: path.resolve(__dirname, `src/components/blog.js`),
          context: {},
        });

        // create a page for all the tags
        createPage({
          path: '/tags',
          component: path.resolve(__dirname, `src/components/all-tags.js`),
          context: { tags },
        });

        // create a page for all the categories
        createPage({
          path: '/categories',
          component: path.resolve(__dirname, `src/components/all-categories.js`),
          context: { categories },
        });

        // create a page for each tag
        Object.keys(tags).forEach((tag) => {
          createPage({
            path: '/tags/' + tag,
            component: path.resolve(__dirname, `src/components/tag.js`),
            context: { tag },
          });
        });

        // create a page for each category
        Object.keys(categories).forEach((category) => {
          createPage({
            path: '/categories/' + category,
            component: path.resolve(__dirname, `src/components/category.js`),
            context: { category },
          });
        });
      })
    );
  });
};
