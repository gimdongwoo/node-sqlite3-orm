import * as ISqlite3 from 'sqlite3';

const sqlite3: typeof ISqlite3 = new Proxy(require('@journeyapps/sqlcipher'), {
  get: (target, prop) => target[prop],
});

export = sqlite3;
