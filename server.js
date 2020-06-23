// Dependencies
// =============================================================
var express = require("express");
var fs = require("fs");
var path = require("path");

// const notesData = require("./db.json")
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./Develop/public")));


//reads the `db.json` file and returns all saved notes as JSON.
app.get("/api/notes", function (req, res) {

  notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
  notesData = JSON.parse(notesData);
  res.json(notesData);

});

//receives a new note to save on the request body, adds it to the `db.json` file, and then returns the new note to the client.
app.post("/api/notes", function (req, res) {

  notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
  notesData = JSON.parse(notesData);
  req.body.id = notesData.length;
  notesData.push(req.body);
  notesData = JSON.stringify(notesData);
  fs.writeFile("./Develop/db/db.json", notesData, "utf8", function (err) {
    if (err) throw (err);

  });

  res.json(JSON.parse(notesData));
  
});

//receives a query parameter containing the id of a note to delete. Reads all notes from the `db.json` file, removes the note with the given `id` property, and then rewrites the notes to the `db.json`file.
app.delete("/api/notes/:id", function (req, res) {
  notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
  notesData = JSON.parse(notesData);
  notesData = notesData.filter(function (note) {
    return note.id != req.params.id;

  });

  notesData = JSON.stringify(notesData);
  fs.writeFile("./Develop/db/db.json", notesData, "utf8", function (err) {
    if (err) throw (err);

  });

  res.send(JSON.parse(notesData));

});

//HTML routes
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});

//API route
app.get("/api/notes", function (req, res) {
  return res.sendFile(path.json(__dirname, "./Develop/db/db.json"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
