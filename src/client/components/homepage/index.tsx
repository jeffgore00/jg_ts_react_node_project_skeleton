import React from 'react';
import styled from 'styled-components';

export const HomepageStylingContainer = styled.div`
  font-family: Helvetica, sans serif;
`;

export const Homepage = (): React.ReactElement => (
  <HomepageStylingContainer>
    <div id="home" data-testid="home">
      <h1>Homepage</h1>
    </div>
  </HomepageStylingContainer>
);
