import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { UUID } from "../utils/constants";

const Layout = ({ children }) => {
  const [uuid, setUuid] = useLocalStorage(UUID, "");

  useEffect(() => {
    !uuid && setUuid(nanoid(23));
  }, []);

  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={(data) => <>{children}</>}
    />
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
