const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

  const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }
//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error al intentar loguear"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn:10000});
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("Usuario logueado con éxito!");
    } else {
      return res.status(208).json({message: "Error al intentar loguear, revisa usuario y contraseña"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    let filtered_book = books[isbn]
    if (filtered_book) {
        let review = req.query.review;
        let reviewer = req.session.authorization['username'];
        if(review) {
            filtered_book['reviews'][reviewer] = review;
            books[isbn] = filtered_book;
        }
        res.send(`Reseña para el libro ${isbn} ha sido añadida.`);
    }
    else{
        res.send("Unable to find this ISBN!");
    }
  });

  // Delete a book review

regd_users.delete("/auth/review/:isbn", (req, res)=>{
    const isbn = req.params.isbn;
    const user = req.session.authorization["username"];
    delete books[isbn]["reviews"][user];
    res.send("Reseña quitada con éxito")
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;