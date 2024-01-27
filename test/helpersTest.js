const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
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
};

describe('getUserByEmail', function() {
  it('should return a user with correct id', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID, `User ID should be ${expectedUserID}`);
  });
  it('should return a user with the correct email', function() {
    const user = getUserByEmail("user2@example.com", testUsers)
    const expectedUserEmail = "user2@example.com";
    assert.equal(user.email, expectedUserEmail, 'User should have the correct email');
  });
});