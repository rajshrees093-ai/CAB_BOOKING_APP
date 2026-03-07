const request = require("supertest");

describe("Ride API Test", () => {

  test("Fetch latest ride", async () => {

    const res = await request("http://localhost:3000")
      .get("/api/rides/latest");

    expect(res.statusCode).toBe(200);

  });

});