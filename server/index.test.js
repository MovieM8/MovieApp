import { expect } from "chai";
import request from "supertest";
import app from "./index.js";
import { pool } from "./helper/db.js";
import { initializeTestDb } from "./helper/test.js";

describe("User API", () => {
  const user = {
    email: "test@example.com",
    password: "Secret123",
    username: "tester",
  };
  let token;

  before(async () => {
    await initializeTestDb();
    await pool.query(
      "TRUNCATE group_members, reviews, favorites, users RESTART IDENTITY CASCADE"
    );
  });
//tarkistaa että voi luoda uuden käyttäjän
  it("sign up", async () => {
    const res = await request(app).post("/user/signup").send({ user });
    //console.log("signup response:", res.status, res.body);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("email", user.email);
  });
//tarkistaa että ettei samalla sähköpostilla voi tehdä kahta tiliä
  it("not allow duplicate signup", async () => {
    const res = await request(app).post("/user/signup").send({ user });
   // console.log("duplicate signup response:", res.status, res.body);
    expect(res.status).to.equal(409);
  });
//tarkistaa että pystyy kirjautua oikeilla tunnuksilla 
  it("log in", async () => {
    const res = await request(app)
      .post("/user/signin")
      .send({ user: { email: user.email, password: user.password } });
   // console.log("login response:", res.status, res.body);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    token = res.body.token;
  });
//tarkistaa että väärä salasana estää kirjautumasta
  it("fail login with wrong password", async () => {
    const res = await request(app)
      .post("/user/signin")
      .send({ user: { email: user.email, password: "Väärä123" } });
    //console.log("wrong password login response:", res.status, res.body);
    expect(res.status).to.equal(401);
  });
//tarkistaa ettei tiliä voi poistaa kirjautumatta 
  it("not delete user without token", async () => {
    const res = await request(app).delete("/user/delete");
    //console.log("delete without token response:", res.status, res.body);
    expect(res.status).to.equal(401);
  });
//tarkistaa että pystyy poistaa tilin kirjautuneena
  it("delete user with token", async () => {
    const res = await request(app)
      .delete("/user/delete")
      .set("Authorization", `Bearer ${token}`)
      .send({ user: { email: user.email } });
   // console.log("delete with token response:", res.status, res.body);
    expect(res.status).to.equal(200);
  });
//tarksitaa että pystyy pirjautua ulos  
  it(" log out", async () => {
  const res = await request(app)
    .post("/user/logout")
    .set("Authorization", `Bearer ${token}`);
  // console.log("logout response:", res.status, res.body);
  expect(res.status).to.equal(200);
  expect(res.body).to.have.property("message", "Logged out successfully");
});
});
//tarkistaa että api palauttaa lsitan arvosteluista
describe("Reviews API", () => {
  it("should fetch all reviews", async () => {
    const res = await request(app).get("/reviews/all");
  //  console.log("reviews response:", res.status, res.body);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });
});
