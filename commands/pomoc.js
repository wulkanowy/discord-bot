const help = [
  {
    command: 'pomoc',
    text: 'Wyświetla pomoc (to).',
  },
  {
    command: 'rola dodaj <nazwa_roli>',
    text: 'Dodaje rolę użytkownikowi.',
  },
  {
    command: 'rola usun <nazwa_roli>',
    text: 'Usuwa rolę użytkownikowi.',
  },
  {
    command: 'pobierz',
    text: 'Daje link do pobrania aplikacji.',
  },
];

exports.run = (client, message) => {
  message.channel.send([
    '**Lista dostępnych komend:**',
    ...help.map(e => `\`!${e.command}\`: ${e.text}`),
  ].join('\n'));
};
