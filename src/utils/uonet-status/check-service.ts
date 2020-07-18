import cheerio from 'cheerio';
import got from 'got';
import { ServiceStatus, StatusCode } from '.';

export default async function checkService(
  url: string,
  expectedTitle: string,
): Promise<ServiceStatus> {
  try {
    const response = await got(url, {
      timeout: 10000,
      responseType: 'text',
    });
    const $ = cheerio.load(response.body);
    const title = $('title').text();

    if (response.body.includes('Podany identyfikator klienta jest niepoprawny')) {
      return {
        code: StatusCode.Error,
        message: $('#MainPage_ErrorDiv div').html()?.split('</h2>')[1]?.split('<br>')[0] || undefined,
      };
    }

    if (response.body.includes('Podany symbol grupujący jest nieprawidłowy')) {
      return {
        code: StatusCode.Error,
        message: $('.block .blockInner').text().trim() || undefined,
      };
    }

    if (response.body.includes('Trwa aktualizacja bazy danych')) {
      const versionsRegex = /Aktualna wersja.*?(\d+\.\d+\.\d+\.\d+).*?do.*?(\d+\.\d+\.\d+\.\d+)/;
      const errorText = $('#MainPage_ErrorDiv div').text();
      const versionsMatch = versionsRegex.exec(errorText);

      if (!versionsMatch) {
        return {
          code: StatusCode.DatabaseUpdate,
          message: errorText,
        };
      }

      return {
        code: StatusCode.DatabaseUpdate,
        oldDatabaseVersion: versionsMatch[1],
        newDatabaseVersion: versionsMatch[2],
      };
    }

    if (expectedTitle === title) {
      return {
        code: StatusCode.Working,
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
    if (error instanceof got.TimeoutError) {
      return {
        code: StatusCode.Timeout,
      };
    }

    console.warn(error);
    return {
      code: StatusCode.Error,
      message: error instanceof Error ? error.message : 'Bardzo nietypowy błąd :confused:',
    };
  }
}
