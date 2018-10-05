var express = require("express");
var app = express();
var PORT = 8080;
var cookieParser = require('cookie-parser')



app.use(cookieParser())
app.set("view engine", "ejs")



const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

console.log("test")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// app.get("/", (req, res) => {
//   res.send("Hello!")
// } );

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});




app.post("/urls/:id", (req, res) => {
  let shortURL = req.params.id;
  let newURL = req.body.newURL;
  urlDatabase[shortURL] = newURL;
  res.redirect(`/urls`);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`) ;
});
function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL; //define the shortURL in the "/urls/:shortURL/delete"
  delete urlDatabase[shortURL]
  res.redirect('/urls/') ;
});

// app.get("/urls/:shortURL/delete", (req, res) => {
//   res.redirect('/urls/');
// });


app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// app.get("/urls", (req, res) => {
//   let templateVars = { greeting: 'Hello World!' };
//   res.render("urls_index", templateVars);
// });

app.get("/urls", (req, res) => {
  let templateVars = {userName: users[req.cookies.user_ID], urls : urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {userName : users[req.cookies.user_ID], shortURL: req.params.id, urls: urlDatabase};
  res.render("urls_show", templateVars);
});



// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get(404, (req, res) =>{
//   res.send("Unknow Path")
// })
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.get('/register', (req, res) =>{
let templateVars = {userName: users[req.cookies.user_ID]};
  res.render("urls_register"); // the template pass the whole database,
})                             // the form of cookies is defined by res.cookie("user_ID", userID);

app.post('/register', (req, res) => {""
  if (req.body.email === "" || req.body.password === "") {
    res.status = 400;
    res.send(res.status).end();
    return;
  }
  for (user in users){
    if (users[user].email === req.body.email) {
        res.status = 400;
        res.send({"email exists": res.status}).end();
        return;
    }
  }
  const userID = generateRandomString();
  users[userID] = {}; //add an empty objecty into the object of "user"
  // res.cookie("email", req.body.email);
  // res.cookie("password", req.body.password);
  res.cookie("user_ID", userID); // save the msg in the cookie

  users[userID].id = userID; //add the key into the object(not an array)
  users[userID].email = req.body.email;
  users[userID].password = req.body.password;
  console.log(users);
  res.redirect("/urls");
 });

 app.get('/login', (req, res) => {
  // let userName = users[req.cookies.user_ID];
  res.render("urls_login");
 });

// app.post("/login", (req, res) =>{
//   res.cookie('user_ID', req.body.usernameField);
//   res.redirect('/urls');
// });


 app.post('/login', (req,res) =>{
  console.log(req.body)
  let email = req.body.email;
  let passWord = req.body.password;
  for (let userID in users){
    if (email === users[userID].email && passWord === users[userID].password) {
      res.cookie("user_ID", userID);
      res.redirect('/urls');
      return;
    }
  }
  res.status(403).send("Please register first");
});

app.post("/logout", (req,res) => {
  res.clearCookie('user_ID');
  res.redirect('/urls');
})

app.listen(PORT, (res, req) => {

  console.log(`Example app is listening on: :port ${PORT}!`);
});
