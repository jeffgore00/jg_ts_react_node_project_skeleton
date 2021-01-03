import React, { useEffect } from 'react';
import styled from 'styled-components';

import logger from '../../utils/logger';

export const HomepageStylingContainer = styled.div`
  font-family: Helvetica, sans serif;
`;

export const HOMEPAGE_RENDERED_LOG = 'Homepage Rendered';

export const Homepage = (): React.ReactElement => {
  useEffect(() => {
    logger.info(HOMEPAGE_RENDERED_LOG);
  }, []);

  return (
    <HomepageStylingContainer>
      <div id="home" data-testid="home">
        <h1>Homepage</h1>
      </div>
    </HomepageStylingContainer>
  );
};
