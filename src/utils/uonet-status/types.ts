export enum StatusCode {
  Working = 0,
  Timeout = 1,
  Error = 2,
  TechnicalBreak = 3
}

export interface ServiceStatus {
  code: StatusCode;
  message: string;
}
