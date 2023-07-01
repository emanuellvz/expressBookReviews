const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

const connectToURL = (url)=>{
    const req = axios.get(url);
    console.log(req);
    req.then(resp => {
        console.log("Fulfilled")
        console.log(resp.data);
    })
    .catch(err => {
        console.log("Rejected for url "+url)
        console.log(err.toString())
    });
}

function connectConParametro(url,parametro){
    connectToURL(url+parametro)
}


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Usuario registrado!. Ya puedes loguearte"});
      } else {
        return res.status(404).json({message: "El usuario ya existe!"});    
      }
    } 
    return res.status(404).json({message: "No se logró crear el usuario."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
 const booksbyauthor = [];
 let isbns = Object.keys(books);
 isbns.forEach((isbn) => {
   if(books[isbn]["author"] === req.params.author) {
     booksbyauthor.push({"isbn":isbn,
                         "author":books[isbn]["author"],
                         "title":books[isbn]["title"],
                         "reviews":books[isbn]["reviews"]});              
   } 
})
res.send(JSON.stringify({booksbyauthor}, null, 4));  
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbyauthor.push({"isbn":isbn,
                            "author":books[isbn]["author"],
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});              
      } 
   })
   res.send(JSON.stringify({booksbyauthor}, null, 4));  
   })

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
 const isbn=req.params.isbn;
 res.send(JSON.stringify(books[isbn].reviews))
});


module.exports.general = public_users;

connectToURL = ("https://emanuellapas-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/");
connectConParametro("https://emanuellapas-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/",1)
connectConParametro("https://emanuellapas-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/","Unknown")
connectConParametro("https://emanuellapas-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/","Things Fall Apart");