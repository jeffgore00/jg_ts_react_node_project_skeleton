import React, { useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

export const HomepageStylingContainer = styled.div`
  font-family: Helvetica, sans serif;
`;

export const Homepage = (): React.ReactElement => {
  useEffect(() => {
    axios.put('/api/logs', {
      logType: 'info',
      logSource: 'UI',
      message: 'Homepage Rendered',
    });
  }, []);

  return (
    <HomepageStylingContainer>
      <div id="home" data-testid="home">
        <h1>Homepage</h1>
      </div>
    </HomepageStylingContainer>
  );
};
