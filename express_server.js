const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
  accessBouncer,
  users,
  urlDatabase,
} = require("./helpers.js");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["secret"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.get("/register", (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];

  if (user) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: null };

    res.render("register", templateVars);
  }
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];

  if (user) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: null };

    res.render("login", templateVars);
  }
});

app.get("/urls", accessBouncer, (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];
  const userURLs = urlsForUser(userId);
  const templateVars = { urls: userURLs, user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", accessBouncer, (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];
  const userURLs = urlsForUser(user);
  const templateVars = { urls: userURLs, user };
  res.render("urls_new", templateVars);
});

app.get("/u/:id", accessBouncer, (req, res) => {
  const shortURL = req.params.id;

  if (!urlDatabase[shortURL]) {
    return res.status(404).send(`Error 404: The URL does not exist!`);
  }

  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls/:id", accessBouncer, (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];
  const shortURL = req.params.id;

  if (!urlDatabase[shortURL]) {
    return res.status(404).send(`Error 404: The URL does not exist!`);
  }

  if (userId !== urlDatabase[shortURL].userId) {
    return res.status(403).send(`Error 403: Unauthorized access!`);
  }

  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    id: shortURL,
    longURL: longURL,
    user: user,
  };

  res.render("urls_show", templateVars);
});

app.get("/urls/:id/edit", accessBouncer, (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];
  const shortURL = req.params.id;

  // Checking if the shortURL exists in your database
  if (!urlDatabase[shortURL]) {
    return res.status(404).send(`Error 404: The URL does not exist!`);
  }

  // Ensuring the user is authorized and exists
  if (userId !== urlDatabase[shortURL].userId) {
    return res.status(403).send(`Error 403: Unauthorized access!`);
  }

  const longURL = urlDatabase[shortURL].longURL; // Fetching longURL
  const templateVars = {
    id: shortURL,
    longURL: longURL, // Make sure this matches what's expected in your ejs template
    user: user,
  };

  res.render("urls_show", templateVars); // Rendering the page with the correct information
});

app.post("/register", (req, res) => {
  const email = req.body.email; // Extract email from the request body
  const password = req.body.password; // Extract password from the request body
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Check if email or password is invalid
  if (email.length <= 6 || password.length <= 6) {
    return res
      .status(400)
      .send(
        `Error 400: ${email} is not a valid email or ${password} is not a valid password`
      );
  }
  if (!email.includes("@")) {
    return res
      .status(400)
      .send(
        `Error 400: ${email} is not a valid email or ${password} is not a valid password`
      );
  }

  const user = getUserByEmail(email, users);
  if (user) {
    return res
      .status(400)
      .send(`Error 400: ${email} already exists in our database`);
  }

  const newUserId = generateRandomString();

  users[newUserId] = {
    id: newUserId,
    email: email,
    password: hashedPassword,
  };

  req.session.userId = newUserId;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password;

  let userId = null;
  const user = getUserByEmail(enteredEmail, users);
  if (user) {
    if (!bcrypt.compareSync(enteredPassword, user.password)) {
      res.status(403).send("Error 403: Invalid email or password");
    } else {
      userId = user.id;
    }
  } else {
    res.status(403).send("Error 403: Invalid email or password");
  }

  if (!userId) {
    res.status(400).send("Error 400: Invalid email or password");
    return;
  }

  req.session.userId = userId;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/urls", accessBouncer, (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];
  const longURL = req.body.longURL;

  if (!longURL) {
    res.send("Please provide a proper URL");
    return;
  }

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userId };

  res.redirect("/urls");
});

app.post("/urls/:id/delete", accessBouncer, (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];

  res.redirect(`/urls`);
});

app.post("/urls/:id/edit", accessBouncer, (req, res) => {
  const userId = req.session.userId;
  const user = users[userId];
  const longURL = req.body.newLongURL;
  const shortURL = req.params.id;

  if (!urlDatabase[shortURL]) {
    return res.status(404).send(`Error 404: The URL does not exist!`);
  }

  if (userId !== urlDatabase[shortURL].userId) {
    return res.status(403).send(`Error 403: unauthorized access!`);
  }

  urlDatabase[shortURL].longURL = longURL;

  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Tinyapp! listening on port ${PORT}!`);
});
