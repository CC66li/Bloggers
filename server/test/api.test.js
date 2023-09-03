// test/api.test.js

const request = require('supertest');
const app = require('../index');  // Replace this with the path to your app
const db = require('../models');
// const User = require('../models/user');
// const Blog = require('../models/blog');
// Blog.belongsTo(User, {foreignKey: 'userId'});

// module.exports = {
//   User,
//   Blog
// };
beforeAll(async () => {
  try {
    await db.sequelize.sync();
  } catch (error) {
    console.error("Error syncing database:", error);
  }
});
let token;

describe("User Registration", () => {
  it("Should register a user", async () => {
    const res = await request(app)
      .post('/register')
      .send({ email: "test@example.com", password: "1234", confirmPassword: "1234" });
    expect(res.statusCode).toEqual(200);
  });
});

describe("User Login", () => {
  it("Should log in a user", async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: "test@example.com", password: "1234" });
    expect(res.statusCode).toEqual(200);
    token = res.body.token;
  });
});

describe("Blog API", () => {
  it("Should create a new blog post", async () => {
    const res = await request(app)
      .post('/blogs')
      .set('Authorization', token)
      .send({ title: "Test Title", description: "Test Description" });
    expect(res.statusCode).toEqual(201);
  });

  it("Should retrieve all blog posts", async () => {
    const res = await request(app)
      .get('/blogs')
      .set('Authorization', token);
    expect(res.statusCode).toEqual(200);
  });

  it("Should update a blog post", async () => {
    const res = await request(app)
      .put('/blogs/1') // Assuming blog with id 1 exists
      .set('Authorization', token)
      .send({ title: "Updated Title", description: "Updated Description" });
    expect(res.statusCode).toEqual(200);
  });

  it("Should delete a blog post", async () => {
    const res = await request(app)
      .delete('/blogs/1') // Assuming blog with id 1 exists
      .set('Authorization', token);
    expect(res.statusCode).toEqual(204);
  });
});

afterAll(async () => {
  await db.sequelize.close();
});