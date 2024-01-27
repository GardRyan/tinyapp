const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['secret'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

const users = {
  666: {
    id: "666",
    email: "1234@gmail.com",
    password: "7418529",
  },
  user2RandomID: {
    id: "id",
    email: "email",
    password: "password",
  },
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "666",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "666",
  },
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

function urlsForUser(id) {
  const userUrls = {};
  for (let urlId in urlDatabase) {
    if (urlDatabase[urlId].userID === id) {
      userUrls[urlId] = urlDatabase[urlId];
    }
  }
  return userUrls;
}

app.get("/register", (req, res) => {

  const templateVars = { user: null };

  res.render("register", templateVars);
});

app.get("/login", (req, res) => {

  const templateVars = { user: null };

  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
  const user = req.session.userId;
  const userURLs = urlsForUser(user);
  const templateVars = { urls: userURLs, user };

  res.render("urls_index", templateVars);
});

app.get("/u/:id", (req, res) => {
  const user = req.session.userId;
  const longURL = urlDatabase[req.params.id].longURL;
  const userURLs = urlsForUser(user);
  const templateVars = { urls: userURLs, longURL, user };

  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = req.session.userId;
  const userURLs = urlsForUser(user);
  const templateVars = { urls: userURLs, user };

  if (!user) {
    res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});

app.post("/register", (req, res) => {

  const email = req.body.email; // Extract email from the request body
  const password = req.body.password; // Extract password from the request body
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Check if email or password is invalid
  if (email.length <= 6 || password.length <= 6) {

    return res.status(400).send(`Error 400: ${email} is not a valid email or ${password} is not a valid password`);

  }
  if (!email.includes("@")) {

    return res.status(400).send(`Error 400: ${email} is not a valid email or ${password} is not a valid password`);

  }

  for (const userId in users) {
    if (users[userId].email === email) {
      return res.status(400).send(`Error 400: ${email} already exists in our database`);
    }
  }

  const newUserId = generateRandomString();

  users[newUserId] = {
    id: newUserId,
    email: email,
    password: hashedPassword,
  };

  req.session.user_id = newUserId;
  res.redirect("/urls");

});

app.post("/login", (req, res) => {

  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password;

  let userId = null;
  for (const id in users) {
    if (users[id].email === enteredEmail) {

      if (bcrypt.compareSync(enteredPassword, users[id].password)) {
        userId = id;
        break;
      } else {
        res.status(403).send("Error 403: Invalid email or password");
        return;
      }
    }
  }

  if (!userId) {
    res.status(400).send("Error 400: Invalid email or password");
    return;
  }

  req.session.user_id = userId;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("userId");
  res.redirect("/login");
});

app.post("/urls", (req, res) => {

  const userID = req.session.userId;

  if (!userID) {
    res.send("Please login to shorten URLs");
    return;
  }

  const longURL = req.body.longURL;

  if (!longURL) {
    res.send("Please provide a proper URL");
    return;
  }

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userID };

  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  const userID = req.session.userId;
  const id = req.params.id;
  delete urlDatabase[id];

  res.redirect(`/urls`);
});

app.post("/urls/:id/edit", (req, res) => {
  const userID = req.session.userId;

  if (!userID) {
    res.send("Please login to shorten URLs");
    return;
  }

  const longURL = req.body.longURL;

  if (!longURL) {
    res.send("Please provide a proper URL");
    return;
  }

  const shortURL = req.params.id;
  urlDatabase[shortURL].longURL = longURL;

  res.redirect("/urls");
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

