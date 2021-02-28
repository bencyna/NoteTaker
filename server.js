// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const generateUniqueId = require("generate-unique-id");

const newId = generateUniqueId();

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3010;

// Enable static files
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes

// Basic route that sends user to the notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// Displays the notes
app.get("/api/notes/", (req, res) => {
  const rawdata = fs.readFileSync("db/db.json", "utf8");
  const database = JSON.parse(rawdata);
  res.json(database);
});

// Creates new Note - Takes in JSON input
app.post("/api/notes", (req, res) => {
  // req.body hosts is equal to the JSON post sent from the user
  let newNote = req.body;

  // Reads current notes in json file
  fs.readFile("db/db.json", function (err, data) {
    const json = JSON.parse(data);

    const indexNum = json.length;

    // adds new note to current notes
    json.push(newNote);
    json[indexNum].uniqueId = newId;

    const jsonString = JSON.stringify(json);

    // adds the updated version of notes
    fs.writeFile("db/db.json", jsonString, "utf8", function (err) {
      if (err) return console.log(err);
      console.log("Note added");
    });

    res.json(jsonString);
  });
});

// Delete note function
app.get("/api/notes/:id", (req, res) => {
  // relative path
  const deleteNote = req.params.id;

  // Reads notes in JSON format
  fs.readFile("db/db.json", function (err, data) {
    const fileData = JSON.parse(data);

    // Searches through the id of the notes
    for (const key in fileData) {
      if (fileData[key].uniqueId == deleteNote) {
        // Deletes note if the id matches the file path
        fileData.splice(key, 1);
        console.log(fileData);
        const newJSON = JSON.stringify(fileData);

        // reqrites the json file without the deleted note
        fs.writeFile("db/db.json", newJSON, "utf8", function (err) {
          if (err) return console.log(err);
          return res.json("Deleted Note");
        });
      } else {
        return res.json("Nothing has occured");
      }
    }
  });
});

// ANy file path that doesn't match above paths will display the overarching page
app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
