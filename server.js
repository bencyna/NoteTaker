// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const generateUniqueId = require("generate-unique-id");
const newId = generateUniqueId();

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3010;

app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes/", (req, res) => {
  const rawdata = fs.readFileSync("db/db.json", "utf8");
  const database = JSON.parse(rawdata);
  res.json(database);
});

app.post("/api/notes", (req, res) => {
  let newNote = req.body;

  fs.readFile("db/db.json", function (err, data) {
    const json = JSON.parse(data);

    const indexNum = json.length;
    // newNote += { uniqueId: newId };

    json.push(newNote);
    json[indexNum].uniqueId = newId;
    console.log(json[indexNum]);

    const jsonString = JSON.stringify(json);

    fs.writeFile("db/db.json", jsonString, "utf8", function (err) {
      if (err) return console.log(err);
      console.log("worked");
    });

    res.json(jsonString);
  });
});

app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
