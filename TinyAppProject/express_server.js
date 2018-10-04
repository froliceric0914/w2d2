var express = require("express");
var app = express();
var PORT = 8080;
var cookieParser = require('cookie-parser')


app.use(cookieParser())
app.set("view engine", "ejs")



const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));



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

app.post("/login", (req, res) =>{
  res.cookie('username', req.body.usernameField);
  res.redirect('/urls');
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

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

// app.get("/urls", (req, res) => {
//   let templateVars = { greeting: 'Hello World!' };
//   res.render("urls_index", templateVars);
// });


app.get("/urls", (req, res) => {
  let templateVars = {userName: req.cookies["username"], urls : urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {userName: req.cookies["username"], shortURL: req.params.id, urls: urlDatabase};
  res.render("urls_show", templateVars);
});

app.post("/logout", (req,res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get(404, (req, res) =>{
//   res.send("Unknow Path")
// })

app.listen(PORT, () => {
  console.log(`Example app is listening on: :port ${PORT}!`);
});
