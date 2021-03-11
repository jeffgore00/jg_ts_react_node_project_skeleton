import { Request, Response } from 'express';

import processLogFromClient from './process-log-from-client';
import { LogType, NewLogRequest } from '../../shared/types/logging';
import logger from '../utils/logger';

const infoLoggerSpy = jest.spyOn(logger, 'info').mockImplementation(jest.fn());
const warnLoggerSpy = jest.spyOn(logger, 'warn').mockImplementation(jest.fn());
const errorLoggerSpy = jest
  .spyOn(logger, 'error')
  .mockImplementation(jest.fn());
const debugLoggerSpy = jest
  .spyOn(logger, 'debug')
  .mockImplementation(jest.fn());

describe('Middleware for logging from external source', () => {
  let response: Partial<Response>;
  const request: Partial<NewLogRequest> = {
    body: {
      message: 'TEST LOG',
      logSource: 'UI',
      logType: LogType.Info,
      additionalData: {
        storeManager: 'John Smith',
        storeId: 39735,
      },
    },
  };

  const expectedLogMessage = `Log from ${request.body.logSource.toUpperCase()}: ${
    request.body.message
  }`;

  beforeAll(() => {
    response = {
      sendStatus: jest.fn(),
    } as Partial<Response>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('responds with 200', () => {
    processLogFromClient(request as Request, response as Response, null);
    expect(response.sendStatus).toHaveBeenCalledWith(200);
  });

  describe('When the request is for an INFO log', () => {
    beforeAll(() => {
      request.body.logType = LogType.Info;
    });
    it('calls the INFO logger with the attached information and prefixes the log message with the log source', () => {
      processLogFromClient(request as Request, response as Response, null);
      expect(infoLoggerSpy).toHaveBeenCalledWith(
        expectedLogMessage,
        request.body.additionalData,
      );
    });
  });

  describe('When the request is for an ERROR log', () => {
    beforeAll(() => {
      request.body.logType = LogType.Error;
    });
    it('calls the ERROR logger with the attached information and prefixes the log message with the log source', () => {
      processLogFromClient(request as Request, response as Response, null);
      expect(errorLoggerSpy).toHaveBeenCalledWith(
        expectedLogMessage,
        request.body.additionalData,
      );
    });
  });

  describe('When the request is for an WARN log', () => {
    beforeAll(() => {
      request.body.logType = LogType.Warn;
    });
    it('calls the WARN logger with the attached information and prefixes the log message with the log source', () => {
      processLogFromClient(request as Request, response as Response, null);
      expect(warnLoggerSpy).toHaveBeenCalledWith(
        expectedLogMessage,
        request.body.additionalData,
      );
    });
  });

  describe('When the request is for a DEBUG log', () => {
    beforeAll(() => {
      request.body.logType = LogType.Debug;
    });
    it('calls the DEBUG logger with the attached information and prefixes the log message with the log source', () => {
      processLogFromClient(request as Request, response as Response, null);
      expect(debugLoggerSpy).toHaveBeenCalledWith(
        expectedLogMessage,
        request.body.additionalData,
      );
    });
  });
});
