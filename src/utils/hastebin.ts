import request from 'request-promise-native';

export async function send(text: string): Promise<string> {
  const options = {
    method: 'POST',
    uri: 'https://hastebin.cf/documents',
    body: text,
  };

  const response = JSON.parse(await request(options));

  return response.key;
}
