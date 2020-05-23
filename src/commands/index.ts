import linki from './linki';
import lorem from './lorem';
import ping from './ping';
import pobierz from './pobierz';
import rola from './rola';
import pomoc from './pomoc';
import status from './status';
import { Command } from '../types';

export default new Map<string, Command>(Object.entries({
  linki,
  lorem,
  ping,
  pobierz,
  pomoc,
  help: pomoc,
  rola,
  status,
}));
