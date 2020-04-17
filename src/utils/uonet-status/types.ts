export enum StatusCode {
  Working = 0,
  Timeout = 1,
  Error = 2,
  DatabaseUpdate = 3,
  TechnicalBreak = 4
}

export interface ServiceStatus {
  code: StatusCode;
  message?: string;
  oldDatabaseVersion?: string;
  newDatabaseVersion?: string;
}
