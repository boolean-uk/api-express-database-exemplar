const express = require("express");

const CreateBooksRouter = (db) => {
  const router = express.Router();
  const { getAllBooks, getBookByID, createBook } = createBooksDBFunctions(db);

  router.get("/", async (req, res) => {
    const type = req.query.type || null;
    const books = await getAllBooks(type);
    res.status(200).json(books);
  });

  router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const [book, found] = await getBookByID(id);
    if (!found) {
      return res.status(404).json({ error: `book not found with id: ${id}` });
    }
    return res.status(200).json(book);
  });

  router.post("/", async (req, res) => {
    const book = req.body;
    const created = await createBook(book);
    return res.status(200).json(created)
  });

  return router;
};

const createBooksDBFunctions = (db) => {
  const getAllBooks = async (type = null) => {
    let query = "SELECT * FROM books";
    let values = [];
    if (type !== null) {
      query += " WHERE type=$1";
      values.push(type);
    }

    try {
      const res = await db.query(query, values);
      return res.rows;
    } catch (e) {
      console.error("error getting books:", e.message);
      return [];
    }
  };

  const getBookByID = async (id) => {
    let query = "SELECT * FROM books WHERE id=$1";
    try {
      const res = await db.query(query, [id]);
      return [res.rows[0], res.rowCount !== 0];
    } catch (e) {
      console.error("error getting book by id", e.message);
      return [null, false];
    }
  };

  const createBook = async (book) => {
    let query = `INSERT INTO books
                 (title, type, author, topic, publicationDate, pages)
                 VALUES ($1, $2, $3, $4, $5, $6) returning *`;
    try {
      const res = await db.query(query, [
        book.title,
        book.type,
        book.author,
        book.topic,
        book.publicationDate,
        book.pages,
      ]);
      return res.rows[0]
    } catch (e) {
      console.error("error inserting new book:", e.message);
    }
  };

  return { getAllBooks, getBookByID, createBook };
};

module.exports = CreateBooksRouter;
