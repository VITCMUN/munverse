process.env.NODE_ENV = "test";

const chai = require("chai");
const chaihttp = require("chai-http");
const User = require("../../../models/user.model");
const app = require("../../../app");

chai.use(chaihttp);
var expect = chai.expect;

describe("users", () => {
  beforeEach("inserting dummy data for testing", async () => {
    var user = new User({
      username: "johndoe",
      user_type: 2,
      profile_picture_url: "/media/user_profile_pictures/test.png"
    });
    await User.register(user, "password");
  });
  afterEach("remove dummy data", async () => {
    await User.find({}).deleteMany();
  });

  it("should list all the users after authentication.", done => {
    var agent = chai.request.agent(app);
    agent
      .post("/login")
      .send({ password: "password", username: "johndoe" })
      .end((err, res) => {
        agent.get("/admin/users").end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
      });
  });

  it("should add a user after authentication.", done => {
    var agent = chai.request.agent(app);
    agent
      .post("/login")
      .send({ password: "password", username: "johndoe" })
      .end((_) => {
        agent
          .post("/admin/user")
          .send({
            username: "janedoe",
            user_type: 0,
            profile_picture: "data:image/png;base64,iVBORw0K",
            password: "password"
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            done();
          });
      });
  });

  it("should update user data after authentication.", done => {
    var agent = chai.request.agent(app);
    agent
      .post("/login")
      .send({ password: "password", username: "johndoe" })
      .end(_ => {
        agent
          .put("/admin/user")
          .send({
            username: "johndoe",
            password: "password2"
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            done();
          });
      });
  });

  it("should delete a user after authentication.", done => {
    var agent = chai.request.agent(app);
    agent
      .post("/login")
      .send({ password: "password", username: "johndoe" })
      .end(_ => {
        agent
          .delete("/admin/user")
          .send({
            username: "johndoe",
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            done();
          });
      });
  });
});
