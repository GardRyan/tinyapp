const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return randomString;
}

app.get("/register", (req, res) => {

  const username = req.cookies.username;
  const templateVars = { urls: urlDatabase, username };

  res.render("register", templateVars);
});


app.get("/urls", (req, res) => {
  const username = req.cookies.username;
  const templateVars = { urls: urlDatabase, username };

  res.render("urls_index", templateVars);
});

app.get("/u/:id", (req, res) => {
  const username = req.cookies.username;
  const longURL = urlDatabase[req.params.id];

  res.redirect(longURL, { username });
});

app.get("/urls/new", (req, res) => {
  const username = req.cookies.username;
  res.render("urls_new", { username });
});

app.post("/login", (req, res) => {
  const username = req.body.username;

  res.cookie("username", username);
  res.redirect(`/urls`);

});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect(`/urls`);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;

  res.redirect(`/urls`);

});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];

  res.redirect(`/urls`);
});

app.post("/urls/:id/edit", (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL;

  res.redirect(`/urls`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Tinyapp! listening on port ${PORT}!`);
});

