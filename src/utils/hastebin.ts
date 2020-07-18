import got from 'got';

export async function send(text: string): Promise<string> {
  const url = 'https://hastebin.cf/documents';

  const response = await got.post<{
    key: string;
  }>(url, {
    responseType: 'json',
    body: text,
  });

  return response.body.key;
}
