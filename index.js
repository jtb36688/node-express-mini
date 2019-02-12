const db = require("./data/db.js");
const express = require("express");
const server = express();

server.use(express.json());

server.listen(5000, () => {
  console.log("\n running on port 5000\n");
});

server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  const user = { name, bio };

  if (!name || !bio) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.insert(user)
    .then(added => {
      res.status(201).json({ success: true, added });
    })
    .catch(err => {
      res
        .status(500)
        .json({
          success: false,
          error: "There was an error while saving the user to the database"
        });
    });
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(found => {
      res.status(200).json({ success: true, found });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: "The user information could not be retrieved."
      });
    });
});

server.get("/api/user/:id", (req, res) => {
  // const userId = req.params.id;
  const { id } = req.params;
  db.findById(id)
    .then(found => {
      if (found) {
        res.status(200).json({ success: true, found });
      } else {
        res.status(404).json({
          success: false,
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: "The user information could not be retrieved."
      });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({
          success: false,
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ success: false, error: "The user could not be removed" });
    });
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  const userchanges = { name, bio };

  if (!name || !bio ) {
      return res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.update(id, userchanges)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({
          success: false,
          message: "The user with specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: "The user information could not be modified."
      });
    });
});
