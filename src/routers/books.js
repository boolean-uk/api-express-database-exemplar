const express = require('express');
const db = require('../utils/database');
const router = express.Router();

//get /books by type - localhost:3030/books?type=fiction
router.get('/', (req, res) => {
  console.log('got get all request!', req.query.type);
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

//localhost:3030/books/3
router.get('/:id', (req, res) => {
  console.log('got get by id request!', req.params.id);
  const selectBooksQuery = 'SELECT * FROM books WHERE id = $1';
  const value = [req.params.id];
  db.query(selectBooksQuery, value)
    .then((databaseResult) => {
      console.log('dbresult', databaseResult.rowCount);
      if (databaseResult.rowCount === 0) {
        res.status(404);
        res.json({ error: 'id does not exist' });
        return;
      }
      res.json({ books: databaseResult.rows });
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: 'Unexpected Error' });
      console.log('db error', error);
    });
});

//localhost:3030/books
router.post('/', (req, res) => {
  console.log('got post new book request!', req.body);
  const addBooksQuery =
    'INSERT INTO books (title,type,author,topic,publicationDate,pages) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';
  const values = [
    req.body.title,
    req.body.type,
    req.body.author,
    req.body.topic,
    req.body.publicationDate,
    req.body.pages,
  ];
  db.query(addBooksQuery, values)
    .then((databaseResult) => {
      res.json({ books: databaseResult.rows });
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: 'Unexpected Error' });
      console.log('db error', error);
    });
});

module.exports = router;
