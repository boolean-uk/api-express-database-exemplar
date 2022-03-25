const express = require("express");

const CreatePetsRouter = (db) => {
  const router = express.Router();
  const { getAllPets, getPetByID } = createPetsDBFunctions(db);

  router.get("/", async (req, res) => {
    const type = req.query.type || null;
    const pets = await getAllPets(type);
    res.status(200).json({ pets: pets });
  });

  router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const [pet, found] = await getPetByID(id);
    if (!found) {
      return res.status(404).json({ error: `pet not found with id: ${id}` });
    }
    return res.status(200).json({ pet: pet });
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

  const getPetByID = async (id) => {
    let query = "SELECT * FROM pets WHERE id=$1";
    try {
      const res = await db.query(query, [id]);
      return [res.rows[0], res.rowCount !== 0];
    } catch (e) {
      console.error("error getting pet by id:", e.message);
      return [null, false];
    }
  };

  return { getAllPets, getPetByID };
};

module.exports = CreatePetsRouter;
