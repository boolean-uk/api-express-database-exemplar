const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());

//TODO: Implement books and pets APIs here

const port = 3030;

//Get the connection object to the database
const db = require("./utils/database");

const CreateBooksRouter = require("./books/router");
const booksRouter = CreateBooksRouter(db);
app.use("/books", booksRouter);

const CreatePetsRouter = require("./pets/router");
const petsRouter = CreatePetsRouter(db);
app.use("/pets", petsRouter);

//Start the server
app.listen(port, () => {
  //Connect to the database
  db.connect((error) => {
    //If there is an error connecting to the database,
    //log it out to the console
    if (error) {
      console.error("[ERROR] Connection error: ", error.stack);
      return;
    }
    console.log("\n[DB] Connected...\n");
  });

  console.log(`[SERVER] Running on http://localhost:${port}/`);
});
