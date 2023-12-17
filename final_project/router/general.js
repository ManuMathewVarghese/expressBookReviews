const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(isValid(username)){
        users.push({"username": username, "password": password});
        res.status(200).json({message:"User created successfully!"});
    } else {
        res.status(404).json({message:"User already exists"});
    }
  }
  res.status(404).json({message:"Unable to register!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise(function(resolve, reject) {
        let book_list = {"books": books};
        if (book_list) {
            resolve(book_list);
        } else {
            reject("Error");
        }
    });

    myPromise.then( 
        (book_list) => res.send(book_list)   
    )
    .catch(
        () => res.send("Something happened. Please try again later")
    );

    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let myPromise = new Promise(function(resolve, reject) {
    let book_list = books[isbn];
    if (book_list) {
        resolve(book_list);
    } else {
        reject("Error");
    }
  });

  myPromise.then( 
    (book_list) => res.send(book_list)   
  )
  .catch(
     () => res.send("Something happened. Please try again later")
  ); 

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let book_list = {"booksbyauthor": []};
    let myPromise = new Promise(function(resolve, reject) {
        Object.entries(books).forEach((b) => {
            const [idx, info] = b;
            if(info.author === req.params.author){
                book_list.booksbyauthor.push(info);
            }
        });
        if (book_list) {
            resolve(book_list);
        } else {
            reject("Error");
        }
    });

    myPromise.then( 
        (book_list) => res.send(book_list)   
    )
    .catch(
        () => res.send("Something happened. Please try again later")
    ); 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let book_list = {"booksbytitle": []};
    let myPromise = new Promise(function(resolve, reject) {
        Object.entries(books).forEach((b) => {
            const [idx, info] = b;
            if(info.title === req.params.title){
                book_list.booksbytitle.push(info);
            }
        });
        if (book_list) {
            resolve(book_list);
        } else {
            reject("Error");
        }
    });

    myPromise.then( 
        (book_list) => res.send(book_list)   
    )
    .catch(
        () => res.send("Something happened. Please try again later")
    ); 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    res.send(JSON.stringify(books[req.params.isbn].reviews));
});

module.exports.general = public_users;
