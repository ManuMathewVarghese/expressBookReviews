const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let valid = true;
    users.filter( (user) => {
       if(user.username === username){
         valid = false;
       }
    });
    return valid;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    if(username && password){
        let validusers = users.filter( (user) => {
            return (user.username === username && user.password === password);
        });
        console.log(validusers);
        if (validusers.length > 0){
            return true;
        }
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            user: username
          }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("Customer successfully logged in.");
    } else {
        return res.status(208).json({message: "Unable to Login!"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("uu", req.user);
  if(req.user){
    let review = books[req.params.isbn].reviews;
    review[req.user] = req.query.review;
    books[req.params.isbn].reviews = review;
    res.send(`The review for book with isbn ${req.params.isbn} has been added/updated.`)
  } else {
    res.send("Please Login to post a review!")
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  if(req.user){
    let review = books[req.params.isbn].reviews;
    delete review[req.user];
    books[req.params.isbn].reviews = review;
    res.send(`Reviews for the ISBN ${req.params.isbn} posted by USER ${req.user} has been deleted.`)
  } else {
    res.send("Please Login to post a review!")
  }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
