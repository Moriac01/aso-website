import * as migration_20261016_133015_initial from './20261016_133015_initial';

export const migrations = [
  {
    up: migration_20261016_133015_initial.up,
    down: migration_20261016_133015_initial.down,
    name: '20261016_133015_initial'
  },
];
