export enum LogTypes {
  Info = 'info',
  Debug = 'debug',
  Warn = 'warn',
  Error = 'error',
}

export interface NewLogBody {
  message: string;
  logType: LogTypes;
  logSource: string;
  additionalData?: Metadata;
}

export interface Metadata {
  [key: string]: string | number;
}
