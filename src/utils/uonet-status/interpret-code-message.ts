import { ServiceStatus, StatusCode } from '.';

export default function interpretCodeMessage(status: ServiceStatus): string {
  if (status.code === StatusCode.Working) return ':white_check_mark: Wszystko powinno działać poprawnie';

  if (status.code === StatusCode.Error) {
    return status.message ? `:warning: Błąd: \`${status.message}\`` : ':warning: Błąd sprawdzania statusu';
  }

  if (status.code === StatusCode.TechnicalBreak) {
    return '<:przerwa:537743331875225601> Przerwa techniczna';
  }

  if (status.code === StatusCode.Timeout) {
    return ':hourglass: Przekroczono limit czasu połączenia';
  }

  return '';
}
