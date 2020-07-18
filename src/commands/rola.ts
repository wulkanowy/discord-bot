import Discord from 'discord.js';
import Client from '../client';

export default async function rola(
  client: Client,
  message: Discord.Message,
  args: string[],
): Promise<void> {
  if (args[0]) {
    if (args[0].toLowerCase() === 'dodaj' && args[1]) {
      const roleName = client.config.roles.find((e: string) => e === args[1].toLowerCase());
      if (!roleName) {
        const availableRolesString = client.config.roles.map((e: string) => `\`${e}\``).join(', ');
        await message.channel.send(`Nieznana rola \`${args[1].toLowerCase()}\`\nDostępne role: ${availableRolesString}`);
      }
      const role = message.guild?.roles?.cache?.find((r: Discord.Role) => r.name === roleName);
      if (!role) {
        await message.channel.send('Błąd: `Nie znaleziono roli na serwerze`');
        return;
      }

      try {
        if (!message.member) {
          await message.channel.send('Błąd:\n```\nNie można określić osoby wysyłającej wiadomość\n```');
          return;
        }
        await message.member.roles.add(role);
        await message.channel.send(`Nadano rolę ${role.name}`);
      } catch (error) {
        console.warn(error);
        await message.channel.send(`Błąd:\n\`\`\`\n${error instanceof Error ? error.message : 'Bardzo nietypowy błąd :confused:'}\n\`\`\``);
      }
    } else if (args[0].toLowerCase() === 'usun' && args[1]) {
      const roleName = client.config.roles.find((e: string) => e === args[1].toLowerCase());
      if (!roleName) {
        const availableRolesString = client.config.roles.map((e: string) => `\`${e}\``).join(', ');
        await message.channel.send(`Nieznana rola \`${args[1].toLowerCase()}\`\nDostępne role: ${availableRolesString}`);
      }
      const role = message.guild?.roles?.cache?.find((r: Discord.Role) => r.name === roleName);
      if (!role) {
        await message.channel.send('Błąd: `Nie znaleziono roli na serwerze`');
        return;
      }

      try {
        if (!message.member) {
          await message.channel.send('Błąd:\n```\nNie można określić osoby wysyłającej wiadomość\n```');
          return;
        }
        await message.member.roles.remove(role);
        await message.channel.send(`Odebrano rolę ${role.name}`);
      } catch (error) {
        console.warn(error);
        await message.channel.send(`Błąd:\n\`\`\`\n${error instanceof Error ? error.message : 'Bardzo nietypowy błąd :confused:'}\n\`\`\``);
      }
    } else if (args[0].toLowerCase() === 'lista') {
      const availableRolesString = client.config.roles.map((e: string) => `\`${e}\``).join(', ');
      await message.channel.send(`Dostępne role: ${availableRolesString}`);
    } else {
      await message.channel.send('Użycie: `!rola <dodaj|usun> <nazwa_roli>` lub `!rola lista`');
    }
  } else {
    await message.channel.send('Użycie: `!rola <dodaj|usun> <nazwa_roli>` lub `!rola lista`');
  }
}
