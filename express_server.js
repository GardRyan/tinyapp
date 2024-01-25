const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const user = {
  userRandomID: {
    id: "id",
    email: "email",
    password: "password",
  },
  user2RandomID: {
    id: "id",
    email: "email",
    password: "password",
  },
}

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
  const id = generateRandomString();
  const email = `user${id}@example.com`; // Using a dummy email for simplicity
  const password = `password${id}`; // Using a dummy password for simplicity

  // Set cookies for the user's information
  res.cookie("user_id", id);
  res.cookie("email", email);
  res.cookie("password", password);

  const templateVars = { urls: urlDatabase, user_id: id, email, password };

  res.render("register", templateVars);

  console.log(`New user Registered! id: ${id}, email: ${email}, password: ${password}`);
});


app.get("/urls", (req, res) => {
  const user = req.cookies.id;
  const templateVars = { urls: urlDatabase, email };

  res.render("urls_index", templateVars, { user });
});

app.get("/u/:id", (req, res) => {
  const user = req.cookies.id;
  const longURL = urlDatabase[req.params.id];

  res.redirect(longURL, { user });
});

app.get("/urls/new", (req, res) => {
  const user = req.cookies.id;
  res.render("urls_new", { user });
});

app.post("/login", (req, res) => {
  const user = req.body.user;

  res.cookie("user", user);
  res.redirect(`/urls`);

});

app.post("/logout", (req, res) => {
  res.clearCookie("user");
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

