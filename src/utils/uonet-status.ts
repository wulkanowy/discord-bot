import cheerio from 'cheerio';
import request from 'request-promise-native';

export enum StatusCode {
  Working = 0,
  Error = 1,
  TechnicalBreak = 2
}

export interface ServiceStatus {
  code: StatusCode;
  message: string;
}

export async function checkService(url: string, expectedTitle: string): Promise<ServiceStatus> {
  try {
    const response = await request(url);
    console.log(`Check status for ${url}`);
    const $ = cheerio.load(response);
    const title = $('title').text();

    if (response.includes('Podany identyfikator klienta jest niepoprawny')) {
      return {
        code: StatusCode.Error,
        message: $('#MainPage_ErrorDiv div').html()?.split('</h2>')[1]?.split('<br>')[0] ?? 'Podany identyfikator klienta jest niepoprawny',
      };
    }

    if (response.includes('Podany symbol grupujący jest nieprawidłowy')) {
      return {
        code: StatusCode.Error,
        message: $('.block .blockInner').text().trim(),
      };
    }

    if (expectedTitle === title) {
      return {
        code: StatusCode.Working,
        message: 'Nie znaleziono problemów',
      };
    }

    if (title === 'Przerwa techniczna') {
      return {
        code: StatusCode.TechnicalBreak,
        message: title,
      };
    }

    return {
      code: StatusCode.Error,
      message: `Nieznana odpowiedź: ${title}`,
    };
  } catch (error) {
    console.warn(error);
    return {
      code: StatusCode.Error,
      message: error.message,
    };
  }
}

export function interpretCodeMessage(status: ServiceStatus): string {
  if (status.code === StatusCode.Working) return ':white_check_mark: Wszystko powinno działać poprawnie';

  if (status.code === StatusCode.Error) {
    return status.message ? `:warning: Błąd: \`${status.message}\`` : ':warning: Błąd sprawdzania statusu';
  }

  if (status.code === StatusCode.TechnicalBreak) {
    return '<:przerwa:537743331875225601> Przerwa techniczna';
  }

  return '';
}
