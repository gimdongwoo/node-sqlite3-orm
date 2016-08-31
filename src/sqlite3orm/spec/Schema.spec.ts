import {field, fk, id, table} from '../decorators';
import {Field, FieldReference} from '../Field';
import {schema} from '../Schema';
import {SQL_MEMORY_DB_PRIVATE, SqlDatabase} from '../SqlDatabase';
import {Table} from '../Table';

function rejectTest(err: Error): void {
  expect('' + err).toBeNull();
}

const TABLE_PARENT_TABLE_NAME = 'PARENTTABLE';
const TABLE_PARENT_FIELD_ID_NAME = 'ID';
const TABLE_PARENT_FIELD_NAME_NAME = 'NAME';

const TABLE_CHILD_TABLE_NAME = 'CHILDTABLE';
const TABLE_CHILD_FIELD_ID_NAME = 'ID';
const TABLE_CHILD_FIELD_NAME_NAME = 'NAME';
const TABLE_CHILD_FIELD_FK_NAME = 'PARENT_ID';
const TABLE_CHILD_FK_CONSTRAINT_NAME = 'PARENT';


@table({name: TABLE_PARENT_TABLE_NAME})
class ParentTable {
  @id({name: TABLE_PARENT_FIELD_ID_NAME, dbtype: 'INTEGER NOT NULL'})
  public id?: number;

  @field({name: TABLE_PARENT_FIELD_NAME_NAME, dbtype: 'TEXT'})
  public name?: string;

  public constructor() {
    this.id = undefined;
    this.name = undefined;
  }
}


@table({name: TABLE_CHILD_TABLE_NAME, autoIncrement: true})
class ChildTable {
  @id({name: TABLE_CHILD_FIELD_ID_NAME, dbtype: 'INTEGER NOT NULL'})
  public id?: number;

  @field({name: TABLE_CHILD_FIELD_NAME_NAME, dbtype: 'TEXT'})
  public name?: string;

  @field({name: TABLE_CHILD_FIELD_FK_NAME, dbtype: 'INTEGER NOT NULL'})
  @fk(TABLE_CHILD_FK_CONSTRAINT_NAME, TABLE_PARENT_TABLE_NAME, TABLE_PARENT_FIELD_ID_NAME)
  public parentId?: number;

  public constructor() {
    this.id = undefined;
    this.name = undefined;
    this.parentId = undefined;
  }
}



// ---------------------------------------------

describe('test schema', () => {
  let sqldb: SqlDatabase;

  // ---------------------------------------------
  beforeAll((done) => {
    sqldb = new SqlDatabase();
    sqldb.open(SQL_MEMORY_DB_PRIVATE).then((res) => done()).catch((err) => {
      rejectTest(err);
      done();
    });
  });

  // ---------------------------------------------
  it('test decorators', () => {
    try {
      let parentTable = schema().getTable(TABLE_PARENT_TABLE_NAME);
      expect(parentTable).toBeDefined();
      expect(parentTable.name).toBe(TABLE_PARENT_TABLE_NAME);
      let parentIdField = parentTable.getTableField(TABLE_PARENT_FIELD_ID_NAME);
      expect(parentIdField).toBeDefined();
      expect(parentIdField.name).toBe(TABLE_PARENT_FIELD_ID_NAME);
      expect(parentIdField.isIdentity).toBeTruthy();
      let parentNameField = parentTable.getTableField(TABLE_PARENT_FIELD_NAME_NAME);
      expect(parentNameField).toBeDefined();
      expect(parentNameField.name).toBe(TABLE_PARENT_FIELD_NAME_NAME);
      expect(parentNameField.isIdentity).toBeFalsy();

      let childTable = schema().getTable(TABLE_CHILD_TABLE_NAME);
      expect(childTable).toBeDefined();
      expect(childTable.name).toBe(TABLE_CHILD_TABLE_NAME);
      let childIdField = childTable.getTableField(TABLE_CHILD_FIELD_ID_NAME);
      expect(childIdField).toBeDefined();
      expect(childIdField.name).toBe(TABLE_CHILD_FIELD_ID_NAME);
      expect(childIdField.isIdentity).toBeTruthy();
      let childNameField = childTable.getTableField(TABLE_CHILD_FIELD_NAME_NAME);
      expect(childNameField).toBeDefined();
      expect(childNameField.name).toBe(TABLE_CHILD_FIELD_NAME_NAME);
      expect(childNameField.isIdentity).toBeFalsy();
      let childFKField = childTable.getTableField(TABLE_CHILD_FIELD_FK_NAME);
      expect(childFKField).toBeDefined();
      expect(childFKField.name).toBe(TABLE_CHILD_FIELD_FK_NAME);
      expect(childFKField.isIdentity).toBeFalsy();
      let childFKFieldRef =
          childFKField.getForeignKeyField(TABLE_CHILD_FK_CONSTRAINT_NAME);
      expect(childFKFieldRef.tableName).toBe(TABLE_PARENT_TABLE_NAME);
      expect(childFKFieldRef.colName).toBe(TABLE_PARENT_FIELD_ID_NAME);

    } catch (e) {
      rejectTest(e);
    }
  });

  // ---------------------------------------------
  it('test create/drop/alter table', (done) => {
    let parentTable = schema().getTable(TABLE_PARENT_TABLE_NAME);
    expect(parentTable).toBeDefined();

    schema()
        // create tables
        .createTable(sqldb, TABLE_PARENT_TABLE_NAME)
        .then((res) => {
          return schema().createTable(sqldb, TABLE_CHILD_TABLE_NAME);
        })
        .then((res) => {
          // alter table add a new column
          let newProperty = Symbol('dyndef');
          let newField = new Field(newProperty);
          newField.name = 'TESTADDCOL';
          newField.dbtype = 'INTEGER';
          parentTable.addPropertyField(newField);
          parentTable.addTableField(newField);
          expect(parentTable.hasPropertyField(newProperty)).toBeTruthy();
          expect(parentTable.hasTableField(newField.name)).toBeTruthy();
          return schema().alterTableAddColumn(
              sqldb, TABLE_PARENT_TABLE_NAME, newField.name);
        })
        .then((res) => {
          // drop tables
          return schema().dropTable(sqldb, TABLE_CHILD_TABLE_NAME);
        })
        .then((res) => {
          return schema().dropTable(sqldb, TABLE_PARENT_TABLE_NAME);
        })
        .then((res) => done())
        .catch((err) => {
          rejectTest(err);
          done();
        });
  });

});
