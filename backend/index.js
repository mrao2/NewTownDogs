const read = require("./SqlFunctions/Read.js");
const create = require("./SqlFunctions/Create.js");
const deleteRow = require("./SqlFunctions/Delete.js");
const update = require("./SqlFunctions/Update.js");
const express = require("express");
const path = require("path");
require("dotenv").config();

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: process.env.Host,
  user: process.env.User,
  password: process.env.Password,
  database: process.env.Database,
});

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.resolve(__dirname, "../frontend")));
app.use(express.json());

//Home functions
app.get("/api/home", async (req, res) => {
  await read(req, res, "SELECT * FROM homepage");
});

app.get("/api/home/:id", async (req, res) => {
  const { id } = req.params;

  await read(req, res, "SELECT * FROM homepage WHERE id = ?", id);
});

app.post("api/home", async (req, res) => {
  await create(req, res, "INSERT INTO homepage set ?");
});

app.delete("/api/home/:id", async (req, res) => {
  const { id } = req.params;
  await deleteRow(req, res, "DELETE FROM homepage WHERE id = ?", id);
});

// Blog Functions!
app.get("/api/data", async (req, res) => {
  await read(req, res, "SELECT * FROM blogs");
});

app.get("/api/data/:BlogId", async (req, res) => {
  const { BlogId } = req.params;

  await read(req, res, "SELECT * FROM blogs WHERE BlogId = ?", BlogId);
});

app.post("/api/data", async (req, res) => {
  await create(req, res, "INSERT INTO blogs SET ?");
});

app.delete("/api/data/:BlogId", async (req, res) => {
  const { BlogId } = req.params;
  await deleteRow(req, res, "DELETE FROM blogs WHERE BlogId = ?", BlogId);
});

app.put("/api/data/:BlogId", async (req, res) => {
  const { BlogId } = req.params;
  const Title = req.body.title;
  const Body = req.body.body;
  const Author = req.body.author;
  await update(
    req,
    res,
    "UPDATE blogs SET Title = ?, Body = ?, Author = ? WHERE BlogId = ?",
    BlogId,
    Title,
    Body,
    Author
  );
});

app.post('/login', (req, res)=> {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT * FROM login_app WHERE email = ?",
    [email, password],
    (err, result) => {

      if(err) {
        res.send({err: err})
      } 
//check if result is 1 array
//use middleware to unhash it to check  
//check if passwords match 
//res.json & nsend back status code 
        if (result) {
          res.send(result)
        } else {
          res.send({message: "Wrong email/password."});
        }
      }
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

