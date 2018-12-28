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
    command: 'rola lista',
    text: 'Wyświetla dostępne role.',
  },
  {
    command: 'pobierz',
    text: 'Daje link do pobrania aplikacji.',
  },
  {
    command: 'wersja',
    text: 'Wyświetla najnowsze wersje aplikacji.',
  },
  {
    command: 'linki',
    text: 'Wyświetla przydatne linki',
  },
  {
    command: 'status',
    text: 'Sprawdza działalność dziennika',
  },
  {
    command: 'lorem',
    text: 'Wyświetla fragment *Lorem ipsum*',
  },
];

exports.run = (client, message) => {
  message.channel.send([
    '**Lista dostępnych komend:**',
    ...help.map(e => `\`${client.config.prefix}${e.command}\`: ${e.text}`),
  ].join('\n'));
};
