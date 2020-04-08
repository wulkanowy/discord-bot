export enum StatusCode {
  Working = 0,
  Error = 1,
  TechnicalBreak = 2
}

export interface ServiceStatus {
  code: StatusCode;
  message: string;
}
