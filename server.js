// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const generateUniqueId = require("generate-unique-id");

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3010;

app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const notes = [];

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes/", (req, res) => {
  const rawdata = fs.readFileSync("db/db.json", "utf8");
  const database = JSON.parse(rawdata);
  console.log(database);
  res.json(database);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;

  // newNote.routeName = newNote.name;

  // console.log(newNote);

  // notes.push(newNote);

  fs.readFile("db/db.json", function (err, data) {
    const json = JSON.parse(data);
    console.log(json);

    // fs.writeFile("db/db.json", function (err) {
    //   if (err) return console.log(err);
    //   json.stringify(json);
    // });

    // res.json(newNote);
  });
});

app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));