const express = require("express");
let books = require("./booksdb.js");
const {
  use,
} = require("../../../nodejs_PracticeProject_AuthUserMgmt/router/friends.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {

  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {

  console.log(req)

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      console.log('here 4');
    if (!doesExist(username)) {
      console.log('here');
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});

// GET /  -> list all books (pretty JSON)
public_users.get("/", (req, res) => {
  console.log("GET / hit (public router)");
  res
    .status(200)
    .set("Content-Type", "application/json") 
    .send(JSON.stringify(books, null, 4)); 
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;
  console.log("here wee hgp");
  console.log(books[parseInt(bookISBN)]);
  return res.status(200).json({ message: books[parseInt(bookISBN)] });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = (req.params.author || "").toLowerCase().trim();

  const book = Object.values(books).find(
    (b) => (b.author || "").toLowerCase() === author
  );

  if (book) return res.status(200).json(book);
  return res.status(404).json({ message: "No book found for this author" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = (req.params.title || "").toLowerCase().trim();

  const book = Object.values(books).find(
    (b) => (b.title || "").toLowerCase() === title
  );

  if (book) return res.status(200).json(book);
  return res.status(404).json({ message: "No book found for this title" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const bookISBN = req.params.isbn;
  console.log("here wee hgp");
  console.log(books[parseInt(bookISBN)]);
  return res
    .status(200)
    .set("Content-Type", "application/json")
    .send(JSON.stringify(books[parseInt(bookISBN)].reviews || {}, null, 4));
});

module.exports.general = public_users;
