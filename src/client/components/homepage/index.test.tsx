import React from 'react';
import { render, screen, getByRole } from '@testing-library/react';

import { setupReactMediaMock } from '../../../../test-utils/react-media';
import { Homepage } from '.';

jest.mock('react-media', () => jest.fn());
setupReactMediaMock();

describe('Homepage', () => {
  let homepage: HTMLElement;

  beforeAll(() => {
    render(<Homepage />);
    homepage = screen.getByTestId('home'); // </nav>
  });

  it('renders heading text', () => {
    expect(getByRole(homepage, 'heading')).toBeTruthy();
  });
});
