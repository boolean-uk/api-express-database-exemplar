const express = require('express');
const db = require('../utils/database');
const router = express.Router();

//get /books by type - localhost:3030/books?type=fiction
router.get('/', (req, res) => {
  console.log('got get by id request!', req.query.type);
  let selectAllBooksQuery = 'SELECT * FROM books ';
  let value;
  if (req.query.type) {
    selectAllBooksQuery = 'SELECT * FROM books WHERE type = $1';
    value = [req.query.type];
  }
  db.query(selectAllBooksQuery, value)
    .then((databaseResult) => {
      console.log('dbresult', databaseResult);
      res.json({ books: databaseResult.rows });
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: 'Unexpected Error' });
      console.log('db error', error);
    });
});

module.exports = router;
