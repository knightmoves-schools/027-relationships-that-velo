const exp = require('constants');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function runScript(db, script) {
  const sql = fs.readFileSync(script, 'utf8');
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const getAllFromEmployee = (db) => {
  const sql = `SELECT * FROM Employee`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const getAllFromContactInfo = (db) => {
  const sql = `SELECT * FROM Contact_Info`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const getAllFromStores = (db) => {
  const sql = `SELECT * FROM Stores`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const buildExpectedResults = (employees, contactInfos, stores) => {
  let results = [];
  employees.forEach((employee) => {
    const contactInfo = contactInfos.find((info) => info.ID === employee.ID);
    const store = stores.find((store) => employee.LOCATION === store.LOCATION);
    if (contactInfo && store && storeInExpectedCities(store)) {
      results.push({
        ID: employee.ID,
        NAME: employee.NAME,
        EMAIL: contactInfo.EMAIL,
        PHONE_NUMBER: contactInfo.PHONE_NUMBER,
        LOCATION: store.LOCATION, 
        REVENUE: store.REVENUE
      });
    }
  });
  return results;
}

const storeInExpectedCities = (store) => {
  const expectedCities = ["Portland", "Los Angeles", "Seattle", "San Francisco"]
  return expectedCities.includes(store.LOCATION);
}

describe('SQL JOIN Operations Autograding', () => {
  let db;
  let scriptPath;

  beforeAll(() => {
    const dbPath = path.resolve(__dirname, '..', 'lesson27.db');
    db = new sqlite3.Database(dbPath);
    scriptPath = path.resolve(__dirname, '..', 'exercise.sql');
  });

  afterAll(() => {
    db.close();
  });

  it('Should correctly perform the JOIN operation across Contact_Info, Employee, and Stores and return columns specified in readme', async () => {
    const employees = await getAllFromEmployee(db);
    const contactInfos = await getAllFromContactInfo(db);
    const stores = await getAllFromStores(db);
    const expected = buildExpectedResults(employees, contactInfos, stores);
    const joinResults = await runScript(db, scriptPath);
    console.log(joinResults);
    console.log(expected)
    expect(joinResults.sort()).toEqual(expected.sort());
  });
});
