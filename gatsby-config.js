module.exports = {
  siteMetadata: {
    title: "Tushar Sharma",
    siteUrl: "https://tusharsharma.dev",
    description:
      "Director of Engineering @Gerald. Passionate about web technologies and cloud security",
    author: "Tushar Sharma",
    keywords: [
      "Director of Engineering",
      "Software Development",
      "Web Development",
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Engineering",
      "Software Engineering",
      "MongoDB",
      "Programming",
      "Coding",
      "HTML",
      "CSS"
    ]
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/content/posts`
      }
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        plugins: ["gatsby-remark-images"],
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
              rel: "nofollow noopener noreferrer"
            }
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 830,
              linkImagesToOriginal: false,
              quality: 90,
              withWebp: true
            }
          },
          {
            resolve: "gatsby-remark-autolink-headers",
            options: {
              maintainCase: false
            }
          }
        ]
      }
    },
    "gatsby-plugin-catch-links",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "tusharsharma.dev",
        short_name: "Tushar",
        start_url: "/",
        background_color: "#2b2b2b",
        theme_color: "#2b2b2b",
        display: "Tushar Sharma",
        icon: "src/images/favicon.png"
      }
    },
    `gatsby-plugin-netlify`
  ]
};
