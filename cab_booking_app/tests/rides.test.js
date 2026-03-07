const request = require("supertest");

describe("Ride API Test", () => {

  test("Unauthorized request should return 401", async () => {

    const res = await request("http://localhost:3000")
      .get("/api/rides/latest");

    expect(res.statusCode).toBe(401);

  });

});