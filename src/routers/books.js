const express = require('express');
const db = require('../utils/database');
const router = express.Router();

//get /books by type - localhost:3030/books?type=fiction
router.get('/', (req, res) => {
  db;
  console.log('got get by id request!', req.query.type);

  res.json({ user: 1 });
});

module.exports = router;
