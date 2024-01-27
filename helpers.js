
const getUserByEmail = function(email, urlDatabase) {
  for (let userId in urlDatabase) {
    const user = urlDatabase[userId];
    
    if (user.email === email) {
      return user;
    }
  }

  return null; 
};

module.exports = { getUserByEmail }