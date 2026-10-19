import * as migration_20261016_133015_initial from './20261016_133015_initial';
import * as migration_20261016_160536_roles_par_fonction from './20261016_160536_roles_par_fonction';
import * as migration_20261016_162128_identite_legale from './20261016_162128_identite_legale';
import * as migration_20261016_165231_dons from './20261016_165231_dons';
import * as migration_20261016_175312_mentions_legales from './20261016_175312_mentions_legales';

export const migrations = [
  {
    up: migration_20261016_133015_initial.up,
    down: migration_20261016_133015_initial.down,
    name: '20261016_133015_initial',
  },
  {
    up: migration_20261016_160536_roles_par_fonction.up,
    down: migration_20261016_160536_roles_par_fonction.down,
    name: '20261016_160536_roles_par_fonction',
  },
  {
    up: migration_20261016_162128_identite_legale.up,
    down: migration_20261016_162128_identite_legale.down,
    name: '20261016_162128_identite_legale',
  },
  {
    up: migration_20261016_165231_dons.up,
    down: migration_20261016_165231_dons.down,
    name: '20261016_165231_dons',
  },
  {
    up: migration_20261016_175312_mentions_legales.up,
    down: migration_20261016_175312_mentions_legales.down,
    name: '20261016_175312_mentions_legales'
  },
];
