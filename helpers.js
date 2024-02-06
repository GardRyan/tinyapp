const users = {
  666: {
    id: "666",
    email: "1234@gmail.com",
    password: "123456789",
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
    userId: "666",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userId: "666",
  },
};

const getUserByEmail = function (email, urlDatabase) {
  for (let userId in urlDatabase) {
    const user = urlDatabase[userId];

    if (user.email === email) {
      return user;
    }
  }

  return null;
};

function generateRandomString() {
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return randomString;
}

function urlsForUser(id) {
  const userUrls = {};
  for (let urlId in urlDatabase) {
    if (urlDatabase[urlId].userId === id) {
      userUrls[urlId] = urlDatabase[urlId];
    }
  }
  return userUrls;
}

module.exports = { getUserByEmail, generateRandomString, urlsForUser, users, urlDatabase};
