import cheerio from 'cheerio';
import request from 'request-promise-native';
import Discord from 'discord.js';

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

export async function sendStatusMessage(
  channels: Array<Discord.TextChannel | Discord.DMChannel>,
  symbol: string,
  lastStatusCode: number | undefined = undefined,
): Promise<number> {
  const studentNewStatus = await checkService(`https://uonetplus-uczen.vulcan.net.pl/${symbol}`, 'Uczeń');
  const studentOldStatus = await checkService(`https://uonetplus-opiekun.vulcan.net.pl/${symbol}`, 'Uczeń');
  const mobileApiStatus = await checkService(`https://lekcjaplus.vulcan.net.pl/${symbol}`, 'UONET+ dla urządzeń mobilnych');

  const statusCode = (studentNewStatus ? studentNewStatus.code * 3 : 0)
      + (mobileApiStatus ? mobileApiStatus.code * 2 : 0)
      + (studentNewStatus ? studentNewStatus.code : 0);

  if (lastStatusCode === undefined || statusCode !== lastStatusCode) {
    const statusColor = Math.max(
        studentNewStatus?.code || 0,
        studentOldStatus?.code || 0,
        mobileApiStatus?.code || 0,
    ) === StatusCode.Working ? '2ecc71' : 'f1c40f';

    const embed = new Discord.MessageEmbed()
      .setTitle(`Status dzienniczka (dla symbolu *${symbol}*)`)
      .setColor(statusColor)
      .addField('Nowy moduł uczeń:', interpretCodeMessage(studentNewStatus))
      .addField('Stary moduł uczeń:', interpretCodeMessage(studentOldStatus))
      .addField('API mobilne:', interpretCodeMessage(mobileApiStatus));

    if (Math.max(
      studentNewStatus.code,
      studentOldStatus.code,
      mobileApiStatus.code,
    ) === StatusCode.Working) {
      embed.setImage('https://i.imgur.com/oBPbqmy.png');
    }

    channels.forEach((statusChannel: Discord.TextChannel | Discord.DMChannel) => {
      statusChannel.send({ embed });
    });
  }

  return statusCode;
}
