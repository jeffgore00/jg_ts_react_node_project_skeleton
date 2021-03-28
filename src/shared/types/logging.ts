export enum LogType {
  Info = 'info',
  Debug = 'debug',
  Warn = 'warn',
  Error = 'error',
}
export interface NewLogRequest {
  body: NewLogBody;
}
export interface NewLogBody {
  message: string;
  logType: LogType;
  logSource: string;
  additionalData?: Metadata;
}
export interface SerializedMetadata {
  [key: string]: string | number | boolean;
}

export interface Metadata {
  [key: string]: unknown;
}
