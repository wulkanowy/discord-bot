import request from 'request-promise-native';

export async function send(text: string): Promise<string> {
  const options = {
    method: 'POST',
    uri: 'hastebin.cf/documents',
    body: text,
    json: true,
  };

  const response = await request(options);

  return response.key;
}
