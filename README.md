# node-sqlite3-orm
This module allows you to map your model, written in JavaScript or TypeScript, to a database schema using SQLite Version 3.
**node-sqlite3-orm** is designed to work with new JavaScript *Decorators*, *Promises* and the *async/await* feature.

> NOTE: Please keep in mind that this module is in early development state! ( transpiled using TypeScript 2.0 and targeting ES6, tested on node 6.3.1 )

> NOTE: Your contribution is highly welcome! Feel free to pick-up a TODO-item or add yours.

## Introduction

**node-sqlite3-orm** provides you with the ability to create the database schema for the mapped model and to store and retrieve the mapped data to and from the database,

```TypeScript
import {table, field, fk, id, TableOpts, FieldOpts} from 'sqlite3orm/decorators';

@table({name: 'USERS'})
class User {
  @id({name: 'user_id', dbtype:'INTEGER NOT NULL'})
  userId: number;

  @field({name: 'user_loginname', dbtype:'TEXT NOT NULL'})
  userLoginName: string;
}

@table({name: 'CONTACTS', autoIncrement: true})
class Contact {
  @id({name: 'contact_id', dbtype:'INTEGER NOT NULL'})
  contactId: number;
  
  @field({name: 'contact_email', dbtype:'TEXT'})
  emailAddress: string;

  @field({name: 'contact_mobile', dbtype:'TEXT'})
  mobile: string;

  @fk('contact_user', 'USERS', 'user_id')
  @field({name: 'user_id', dbtype:'INTEGER NOT NULL'})
  userId: number;
}
```

With **node-sqlite3-orm** you have full control over the names for tables, fields and foreign key constraints in the mapped database schema.
Properties without a *node-sqlite3-orm* decorator will not be mapped to the database.

## Database Connection

```TypeScript
import {SqlDatabase} from 'sqlite3orm/SqlDatabase';

(async () => {
  let sqldb = new SqlDatabase();
  await sqldb.open(':memory:');
})();
```
SqlDatabase is a thin promised-based wrapper around sqlite3.Database: [node-sqlite3](https://github.com/mapbox/node-sqlite3) 

## Schema Creation

```TypeScript
import {schema} from 'sqlite3orm/Schema';

(async () => {
  // get the user_version from the database:
  let userVersion = await sqldb.getUserVersion();

  // create all the tables if they do not exist:
  await schema().createTable(sqldb,'USERS');
  await schema().createTable(sqldb,'CONTACTS');

  if (userVersion >= 1 && userVersion <= 10) {
    // the 'CONTACTS' table has been introduced in user_version 1 
    // a column 'contact_mobile' has been added to the 'CONTACTS' table in user_version 10
    await schema().alterTableAddColumn(sqldb, 'CONTACTS', 'contact_mobile');
  }
  await sqldb.setUserVersion(10);

})();
```


## Read/Insert/Update/Delete using DAOs

In order to read from or write to the database, you can use the `BaseDAO<Model>' class

```TypeScript

(async () => {

  let userDAO = new BaseDAO(User, sqldb);
  let contactDAO = new BaseDAO(Contact, sqldb);

  let newUser: User;
  newUser.userId = 1;
  newUser.userLoginName = 'donald';
  await userDAO.insert(newUser);

  let newContact: Contact;
  contact.userId = 1;
  contact.emailAddress = 'donald@duck.com'

  let users = await userDAO.selectAll();
  let userDonald = await userDAO.selectAll('WHERE user_loginname="donald"');
  let contactsDonald = await contactDAO.selectAllOf('contact_user', User, userDonald);

})();

```


## Install

```
$ npm install node-sqlite3-orm
```

When using TypeScript, the compiler options `experimentalDecorators` and `emitDecoratorMetadata` must be enabled.

tsconfig.json:
```JSON
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    ...
  },
  ...
}
```


## License

sqlite3-orm-js is licensed under the MIT License:
[LICENSE](./LICENSE)


