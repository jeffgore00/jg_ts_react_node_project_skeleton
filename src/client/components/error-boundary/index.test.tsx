/* eslint-disable @typescript-eslint/ban-ts-comment, no-underscore-dangle, no-console */
import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';

import { ErrorBoundary } from '.';
import logger from '../../utils/logger';

const FaultyComponent = (): React.ReactElement => {
  useEffect(() => {
    throw new Error('unique error');
  }, []);
  return <div data-testid="faulty-component" />;
};

describe('Error boundary', () => {
  let fallbackUi: HTMLElement;

  describe('When one of its children components throw an error', () => {
    let loggerSpy: jest.SpyInstance;
    let faultyComponent: HTMLElement;

    beforeAll(() => {
      jest.spyOn(console, 'error').mockImplementation(() => null);

      // @ts-ignore
      loggerSpy = jest.spyOn(logger, 'error').mockImplementation(jest.fn());
      render(
        <ErrorBoundary>
          <FaultyComponent />
        </ErrorBoundary>
      );
      fallbackUi = screen.queryByTestId('react-error-fallback-ui');
    });

    it('logs the error', () => {
      expect(loggerSpy).toHaveBeenCalledWith(
        'Error Caught by React Error Boundary: Error: unique error',
        {
          errorComponentStack: `
    in FaultyComponent
    in ErrorBoundary`,
        }
      );
    });
    it('renders the fallback ui', () => {
      expect(fallbackUi).toBeTruthy();
      expect(faultyComponent).not.toBeTruthy();
    });
  });

  describe('When there is no error', () => {
    let healthyComponent: HTMLElement;

    beforeAll(() => {
      render(
        <ErrorBoundary>
          <div data-testid="healthy-component" />
        </ErrorBoundary>
      );
      healthyComponent = screen.queryByTestId('healthy-component');
      fallbackUi = screen.queryByTestId('react-error-fallback-ui');
    });

    it('renders the children', () => {
      expect(fallbackUi).not.toBeTruthy();
      expect(healthyComponent).toBeTruthy();
    });
  });
});
