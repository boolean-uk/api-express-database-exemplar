const express = require('express');
const db = require('../utils/database');
const router = express.Router();

//get /books by type - localhost:3030/pets?type=dog
router.get('/', (req, res) => {
  console.log('got get all request!', req.query.type);
  let selectAllPetsQuery = 'SELECT * FROM pets ';
  let value;
  if (req.query.type) {
    selectAllPetsQuery = 'SELECT * FROM pets WHERE type = $1';
    value = [req.query.type];
  }
  db.query(selectAllPetsQuery, value)
    .then((databaseResult) => {
      console.log('dbresult', databaseResult);
      res.json({ pets: databaseResult.rows });
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: 'Unexpected Error' });
      console.log('db error', error);
    });
});

//localhost:3030/pets/3
router.get('/:id', (req, res) => {
  console.log('got get by id request!', req.params.id);
  const selectPetsQuery = 'SELECT * FROM pets WHERE id = $1';
  const value = [req.params.id];
  db.query(selectPetsQuery, value)
    .then((databaseResult) => {
      console.log('dbresult', databaseResult.rowCount);
      if (databaseResult.rowCount === 0) {
        res.status(404);
        res.json({ error: 'id does not exist' });
        return;
      }
      res.json({ pets: databaseResult.rows });
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: 'Unexpected Error' });
      console.log('db error', error);
    });
});

//localhost:3030/pets
router.post('/', (req, res) => {
  console.log('got post new pet request!', req.body);
  const addBooksQuery = 'INSERT INTO pets (name,age,type,breed,microchip) VALUES($1,$2,$3,$4,$5) RETURNING *';
  const values = [req.body.name, req.body.age, req.body.type, req.body.breed, req.body.microchip];
  db.query(addBooksQuery, values)
    .then((databaseResult) => {
      res.json({ pets: databaseResult.rows });
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: 'Unexpected Error' });
      console.log('db error', error);
    });
});

module.exports = router;
