import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { StaticQuery, graphql } from "gatsby";

function SEO({ description, lang, meta, keywords = [], title, scripts = [] }) {
  return (
    <StaticQuery
      query={detailsQuery}
      render={(data) => {
        const metaDescription =
          description || data.site.siteMetadata.description;
        const allKeywords = keywords.concat(data.site.siteMetadata.keywords);
        return (
          <Helmet
            htmlAttributes={{
              lang,
            }}
            title={`${title ? title + " | " : ""}${
              data.site.siteMetadata.title
            }`}
            meta={[
              {
                name: `description`,
                content: metaDescription,
              },
              {
                property: `og:title`,
                content: title,
              },
              {
                property: `og:description`,
                content: metaDescription,
              },
              {
                property: `og:type`,
                content: `website`,
              },
              {
                name: `twitter:card`,
                content: `summary`,
              },
              {
                name: `twitter:creator`,
                content: data.site.siteMetadata.author,
              },
              {
                name: `twitter:title`,
                content: title,
              },
              {
                name: `twitter:description`,
                content: metaDescription,
              },
            ]
              .concat(
                allKeywords.length > 0
                  ? {
                      name: `keywords`,
                      content: allKeywords.join(`, `),
                    }
                  : []
              )
              .concat(meta)}
          >
            {process.env.NODE_ENV === "production" && (
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=UA-124607330-1"
              />
            )}
            {scripts.length > 0
              ? scripts.forEach((url) => (
                  <script async src={url} charset="utf-8"></script>
                ))
              : null}
            {process.env.NODE_ENV === "production" && (
              <script>
                {`
              window.dataLayer = window.dataLayer || [];
               function gtag() {
                dataLayer.push(arguments);
              }
              gtag('js', new Date());
        
              gtag('config', 'UA-124607330-1');

              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
                
                ga('create', 'UA-124607330-1', 'auto');
                ga('send', 'pageview');
              `}
              </script>
            )}
          </Helmet>
        );
      }}
    />
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  keywords: [],
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
};

export default SEO;

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        keywords
        description
        author
      }
    }
  }
`;
