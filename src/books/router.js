const express = require("express");

const CreateBooksRouter = (db) => {
  const router = express.Router();
  const { getAllBooks, getBookByID } = createBooksDBFunctions(db);

  router.get("/", async (req, res) => {
    const type = req.query.type || null;
    const books = await getAllBooks(type);
    res.status(200).json(books);
  });

  router.get("/:id", async (req, res) => {
      const id = req.params.id
      const [book, found] = await getBookByID(id)
      if (!found) {
          return res.status(404).json({error: `book not found with id: ${id}`})
      }
      return res.status(200).json(book)
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

  return { getAllBooks, getBookByID };
};

module.exports = CreateBooksRouter;
