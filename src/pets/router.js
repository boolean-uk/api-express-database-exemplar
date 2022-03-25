const express = require("express");

const CreatePetsRouter = (db) => {
  const router = express.Router();
  const { getAllPets } = createPetsDBFunctions(db);

  router.get("/", async (req, res) => {
    const type = req.query.type || null;
    const pets = await getAllPets(type);
    res.status(200).json({ pets: pets });
  });

  return router;
};

const createPetsDBFunctions = (db) => {
  const getAllPets = async (type = null) => {
    let query = "SELECT * FROM pets";
    let values = [];
    if (type !== null) {
      query += " WHERE type=$1";
      values.push(type);
    }

    try {
      const res = await db.query(query, values);
      return res.rows;
    } catch (e) {
      console.error("error getting pets:", e.message);
      return [];
    }
  };

  return { getAllPets };
};

module.exports = CreatePetsRouter;
