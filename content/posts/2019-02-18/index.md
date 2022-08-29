---
title: 'Gatsby Internals for Developers'
category: 'Frameworks'
uid: 'gatsby-internals-for-developers'
draft: false
excerpt: "Exploring Gatsby's powerful features with little to no documentation on web."
tags:
  - javascript
  - gatsby
---

[Gatsby](https://www.gatsbyjs.org/) is a great tool. But at times I've struggled to find good documentation/examples of
some of the APIs that is available to connect your blog with a custom backend for providing content (files, database, cms, etc).
In this blog I'll cover a few of such APIs and how to use them to build your blog from markdown files.

## How it works ⚙️?

### An Overview

In Gatsby you write page templates in _JSX_ and optionaly you also provide a way to get dynamic content for a page. Generally
through a _GraphQL_ Query.

So if you want to have a page on your website at `your-website.com/about.html`
you will create a _React Component_ in `src/pages/about.js`

```js
import React from 'react';

export default function About() {
  return <div>About Me</div>;
}
```

Right now it's just static content here which is a string `About Me`.
If I want to make this string dynamic, I can use a GraphQL query to do that.

```js
import React from 'react';
import { graphql } from 'gatsby';

export default function About({ data }) {
  return <div>{data.dynamicString}</div>;
}

export const query = graphql`
  query aboutMeDynamicContent {
    # Your GraphQL Query here
  }
`;
```

Now It might seem as if everytime this component loads it first fetches the data and then renders it. What really happens is
Gatsby doesn't load any dynamic content during runtime or when your website is live. It does that **once only** during the **build time**.

So, all the queries or api calls that you define are called during the time when your website is
being built by Gatsby where it goes through all of your defined components and generate _static HTML_ from those components.
If the compiler also finds a GraphQL Query, it calls those queries and stores all the data from those
queries and use that data to generate _static HTML_ of that page component. After the building process your app should become fully static i.e it has all
the data that it needs, so it doesn't have to query for any dynamic content during runtime.

> Gatsby uses server-side rendering to generate a prerendered SPA, which is rehydrated into a fully functional React app.
> Gatsby stores all the data in a large JSON file.

Now I don't want to go over the details of how it works. There are so many great articles out there which does an amazing job
describing the same. Let's move to some of the more cool stuff.

### An Inside Look

A _Node_ is the base of all the data models used in Gatsby.

```js
type Node = {
  id: String, // a unique id of each node
  children: Array[String], // an array of node ids
  parent: String, // parent node id, undefined if no parent
  fields: Object, // this is for us to add any custom property to this node
  internal: {
    type: String, // A globally unique name chosen by the plugin who created this node.
    ...
  },
  ...other fields specific to this type of node
}
```

The GraphQL queries that we type target these nodes for data.

To get a better understanding of the node creation and manipulation process, let's
write some dummy plugins to create blog posts from markdown files.

> I'll be writing pseudo code for some part to avoid complexity.
> Also I'll be writing a lot of comments to describe various parts of code. Make sure you read them.

Our directory structure looks something like this

```shell
content/
  my-journey-to-neverland.md
  my-new-blog.md
src/
  components/
    post.js
  pages/
    index.js
gatsby-node.js
package.json
```

#### Step 1 - Read Markdown Files 🥔

We'll create a plugin for that. Let's call our plugin `my-file-reader`

The implementation will look something like this in the file named `gatsby-node.js`.

```js

// helper function to read a file : PSEUDO
function readFile(path){
  ... read file at path `path`
  return {
    name,
    content,
    path,
    fileType,
    modifiedAt,
    createdAt
  };
}

// this function is called by gatsby to check if we've defined
// any nodes. You will use this if you want to register/create nodes. We are using it
// because we want to read files and create/register them as nodes in gatsby
exports.sourceNodes = (
  { actions, getNode, createNodeId },
  pluginOptions ) => {

  const { createNode } = actions; // helper function to register a node with gatsby
  const fileDirectory = pluginOptions.path; // path defined in plugin options to read files from

  // iterating over the directory content
  fileDirectory.forEach((filePath) => {
  // reading file at given path
  const file = readFile(filePath);
    // registering our node
    createNode({
      id: createNodeId(), // assigning a unique id through helper function
      children: [], // no children at this point
      parent: undefined, // no parent
      internal: {
        type: 'MySourceFileNode', // A globally unique name for this node type
      },
      // custom properties of our file node
      name: file.name,
      content: file.content,
      path: file.path,
      fileType: file.fileType,
      modifiedAt: file.modifiedAt,
      createdAt: file.createdAt
    });
  });
}

```

At this point we've read our `.md` files and informed gatsby about our custom made file nodes.
They will now be available for our GraphQL queries. Gatsby will automatically create
a GraphQL schema for us. We can query for file name, file type and all other properties using GraphQL.

Good news is that you don't have to write a plugin to read plain raw files. There
is an [official plugin](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-source-filesystem#readme) for that 🤝.

#### Step 2 - Create HTML from Markdown 🍟

Now that we have raw `.md` files in our system represented as nodes. We will create
a new type of node which will contain our html (after compiling our raw markdown to html).

We'll create another plugin for that. Let's call our plugin `my-md-transformer`

The implementation will look something like this in the file named `gatsby-node.js`.

```js
const mdToHtml = require('magic-md-to-html-transformer'); // pretty sure this doen't exist

// helper function to create our new node
function createMDNode({ id, node, content }) {
  const { html } = mdToHtml(content);
  // creating data structure for our new node
  const mdNode = {
    id,
    children: [],
    // the parent our new node will be the file node
    // because we've derived the new node from the file node
    parent: node.id,
    internal: {
      content: content,
      // setting a unique name for our new node
      type: 'Md',
    },
  };

  mdNode.html = html;
  return mdNode;
}

// gatsby calls this fuction for each node that it has created
// this is also a good place to modify/add a node
// it will be called for each of our `MySourceFileNode`
exports.onCreateNode = async (
  {
    node, // the node itself
    loadNodeContent,
    actions,
    createNodeId, //helper function to create a unique node id
    getNode, // helper function to get any node by passing the id
  },
  pluginOptions
) => {
  const { createNode, createParentChildLink, createNodeField } = actions;

  // we only want to transform nodes of type `MySourceFileNode`
  // rest we don't care
  if (node.internal.type !== 'MySourceFileNode') {
    return;
  }

  // helper function to read node's content
  // in our case the content would be the content of our raw md files
  const content = await loadNodeContent(node);

  // here we are creating a new node type
  // this new node type will contain our html transformed from md
  // we are passing in the raw content of our md files to our helper function
  const mdNode = createMDNode({
    id: createNodeId(),
    node,
    content,
  });

  // registering our new node with getsby
  // after this it will be available in our GraphQL API
  createNode(mdNode);

  // this is a helper functin to inform the parent node that it has a new child 👼🏻
  // remember the `children` property, yes i think it updates that property of the parent to include this new child
  createParentChildLink({ parent: node, child: mdNode });

  // creating a custom field named slug on our new node
  // remember we have a fields property on each node
  // the field we create here gets added to that property
  createNodeField({
    name: 'slug', // field name
    mdNode, // the node on which we want to add a custom field
    value: kebabCase(node.fileName), // field value
  });
};
```

At this point we have our html markup ready, stored in our newly created nodes as a property.
Next step is to register urls with gatsby to serve that markup.

The node store used internally by gatsby will have something like this

```js
[
  {
    id: '123456',
    children: ['abc'],
    parent: ,
    internal: {
      type: 'MySourceFileNode',
    },
    name: 'my-new-blog',
    content: '↵# My New Blog↵↵Hello World!',
  },
  {
    id: '7891011',
    children: ['ghi'],
    parent: ,
    internal: {
      type: 'MySourceFileNode',
    },
    name: 'my-journey-to-neverland',
    content: '↵# Journey to neverland↵↵Hello World!',
  },
  {
    id: 'abc',
    children: [],
    parent: '123456',
    internal: {
      type: 'Md',
    },
    field: {
      slug: 'my-new-blog',
    },
    html: '<bod><body><h1>My New Blog</h1><p>Hello World!</p></body></html>',
  },
  {
    id: 'ghi',
    children: [],
    parent: '7891011',
    internal: {
      type: 'Md',
    },
    field: {
      slug: 'my-journey-to-neverland',
    },
    html: '<bod><body><h1>Journey to neverland</h1><p>Hello World!</p></body></html>',
  }
]
```

#### Step 3 - Serve HTML Pages 🍽

Now we want to tell Gatsby to render our blogs on urls specified by us.
Gatsby also provides an API for this purpose.

```js
// gatsby calls this fuction to give us an oppurtunity
// to register new pages with gatsby.
// We are using it to create a page for each of our blog
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions; // helper function to register a page

  // we must return a promise
  // here we are querying our graphql api to get
  // all the `Md` nodes that we created
  // note that gatsby automatically creates GraphQL schema
  // for such queries like `allMd` and `allMySourceFileNode`
  // using the nodes that we've defined earlier
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMd {
              #edges is like results
              edges {
                node {
                  id
                  fields {
                    slug
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

        // storing our blogs in a variable
        const posts = result.data.allMd.edges;

        // iterating over all of our blogs
        posts.forEach(({ node }, index) => {
          // using the helper function
          // we create and register our page with gatsby
          createPage({
            path: node.fields.slug, // '/my-new-blog`
            // path of the react component which should render this html
            component: path.resolve(__dirname, `src/components/post.js`),
            // any data you want to pass to the react component that will render this
            context: {
              id: node.id,
            },
          });
        });
      })
    );
  });
};
```

That's it, our markdown files are now ready to be served as HTML pages. This example
was based on markdown content present in our file system but we can use anything as a content provider(API, CMS, Remote FileSystem) and create content/pages for our website. That's the power of Gatsby.

I enjoyed exploring Gatsby and that's the only reason I made a rewrite to my website. If you have any questions regarding this blog, reach me out
at _ts17995@gmail.com_. I'll be happy to respond.
