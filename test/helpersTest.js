// console.log(__dirname);

// const helpers = require('../helpers.js');
// console.log(helpers);

const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, '..'), (err, files) => {
  if (err) {
    console.error(err);
  } else {
    console.log(files); // Check if 'helpers.js' is listed in the output
  }
});



// const { assert } = require('chai');

// const { getUserByEmail } = require('../helpers.js');

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const { expect } = chai;

// chai.use(chaiHttp);
// const app = require('../express_server.js');


// const testUsers = {
//   "userRandomID": {
//     id: "userRandomID", 
//     email: "user@example.com", 
//     password: "purple-monkey-dinosaur"
//   },
//   "user2RandomID": {
//     id: "user2RandomID", 
//     email: "user2@example.com", 
//     password: "dishwasher-funk"
//   }
// };

// describe('getUserByEmail', function() {
//   it('should return a user with correct id', function() {
//     const user = getUserByEmail("user@example.com", testUsers)
//     const expectedUserID = "userRandomID";
//     assert.equal(user.id, expectedUserID, `User ID should be ${expectedUserID}`);
//   });
//   it('should return a user with the correct email', function() {
//     const user = getUserByEmail("user2@example.com", testUsers)
//     const expectedUserEmail = "user2@example.com";
//     assert.equal(user.email, expectedUserEmail, 'User should have the correct email');
//   });
// });



// describe("Login and Access Control Test", () => {
//   it('should return 403 status code for unauthorized access to "http://localhost:3000/urls/b6UTxQ"', () => {
//     const agent = chai.request.agent("http://localhost:3000");

//     // Step 1: Login with valid credentials
//     return agent
//       .post("/login")
//       .send({ email: "user2@example.com", password: "dishwasher-funk" })
//       .then((loginRes) => {
//         // Step 2: Make a GET request to a protected resource
//         return agent.get("/urls/b6UTxQ").then((accessRes) => {
//           // Step 3: Expect the status code to be 403
//           expect(accessRes).to.have.status(403);
//         });
//       });
//   });
// });


// describe('GET Requests', function() {
//   const agent = chai.request.agent(app); // Creating an agent for session persistence

//   // Assuming your Express app handles sessions and redirects properly

//   it('should redirect / to /login with status code 302', async function() {
//     const res = await agent.get('http://localhost:8080/');
//     expect(res).to.redirectTo('http://localhost:8080/login');
//     expect(res).to.have.status(302);
//   });

//   it('should redirect /urls/new to /login with status code 302', async function() {
//     const res = await agent.get('http://localhost:8080/urls/new');
//     expect(res).to.redirectTo('http://localhost:8080/login');
//     expect(res).to.have.status(302);
//   });

//   it('should return status code 404 for non-existing URL', async function() {
//     const res = await agent.get('http://localhost:8080/urls/NOTEXISTS');
//     expect(res).to.have.status(404);
//   });

//   it('should return status code 403 for an existing URL without proper authentication', async function() {
//     const res = await agent.get('http://localhost:8080/urls/b6UTxQ');
//     expect(res).to.have.status(403);
//   });

//   after(function() {
//     agent.close(); // Close the agent after all tests are done
//   });
// });
