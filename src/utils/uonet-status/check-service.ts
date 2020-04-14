import request from 'request-promise-native';
import cheerio from 'cheerio';
import { ServiceStatus, StatusCode } from '.';

export default async function checkService(
  url: string,
  expectedTitle: string,
): Promise<ServiceStatus> {
  try {
    const response = await request({
      url,
      timeout: 10000,
    });
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
    if (error.cause.code === 'ETIMEDOUT') {
      return {
        code: StatusCode.Timeout,
        message: 'Przekroczono limit czasu połączenia',
      };
    }

    console.warn(error);
    return {
      code: StatusCode.Error,
      message: error.message,
    };
  }
}
