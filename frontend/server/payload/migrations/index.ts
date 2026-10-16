import * as migration_20261016_133015_initial from './20261016_133015_initial';
import * as migration_20261016_160536_roles_par_fonction from './20261016_160536_roles_par_fonction';

export const migrations = [
  {
    up: migration_20261016_133015_initial.up,
    down: migration_20261016_133015_initial.down,
    name: '20261016_133015_initial',
  },
  {
    up: migration_20261016_160536_roles_par_fonction.up,
    down: migration_20261016_160536_roles_par_fonction.down,
    name: '20261016_160536_roles_par_fonction'
  },
];
