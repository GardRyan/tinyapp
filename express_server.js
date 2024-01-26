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
};

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
  const email = "";
  const password = "";

  res.cookie("user_id", id);
  res.cookie("email", email);
  res.cookie("password", password);

  const templateVars = { urls: urlDatabase, user: id, email, password };

  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const user = req.cookies.userId;
  const templateVars = { urls: urlDatabase, user };

  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
  const user = req.cookies.userId;
  const templateVars = { urls: urlDatabase, user };

  res.render("urls_index", templateVars);
});

app.get("/u/:id", (req, res) => {
  const user = req.cookies.userId;
  const longURL = urlDatabase[req.params.id];
  const templateVars = { urls: urlDatabase, longURL, user };

  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = req.cookies.userId;
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_new", templateVars);
});

app.post("/register", (req, res) => {
  const newUserId = generateRandomString();
  const email = req.body.email; // Extract email from the request body
  const password = req.body.password; // Extract password from the request body

  // Check if email or password is invalid
  if (email.length <= 6 || password.length <= 6) {

    return res.status(400).send(`Error 400: ${email} is not a valid email or ${password} is not a valid password`);

  } 
  
  for (const userId in user) {
    if (user[userId].email === email) {
      return res.status(400).send(`Error 400: ${email} already exists in our database`);
    }
  }

  user[newUserId] = {
    id: newUserIdserId,
    email: email,
    password: password,
  };

  // Set cookies for the user's information
  res.cookie("user_id", userId);
  res.cookie("email", email);
  res.cookie("password", password);

  res.redirect("/urls");
  console.log(`New user Registered! id: ${id}, email: ${email}, password: ${password}`);
});

app.post("/login", (req, res) => {

  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password; 
  
  const authenticateUser = (req, res, next) => {
    const user = req.cookies.userId; 
    
    if (user) {
       next();
     } else {
       res.redirect("/login");
     }
  }
  let userId = null;
  for (const id in user) {
    if (user[id].email === enteredEmail && user[id].password !== enteredPassword) {
      res.status(403).send("Error 403: Invalid email or password");
      break;
    }
    if (user[id].email === enteredEmail && user[id].password === enteredPassword) {
      userId = id;
      break;
    }
  }
  
  if (userId) {
    res.cookie("user_id", userId);
    res.redirect("/urls");
  } else {
    res.status(400).send("Error 400: Invalid email or password");
  }

  app.use(authenticateUser); 
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.post("/urls", (req, res) => {
  const user = req.cookies.userId;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;

  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.userId;
  delete urlDatabase[id];

  res.redirect(`/urls`);
});

app.post("/urls/:id/edit", (req, res) => {
  const shortURL = req.params.userId;
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

