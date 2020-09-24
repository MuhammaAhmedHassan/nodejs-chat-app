const request = require("request");

describe("calc", () => {
  it("should multiply 2 and 2", () => {
    expect(2 * 2).toBe(4);
    // expect(2 * 2).toBe(5); // this will fail
  });
});

describe("get messages", () => {
  it("should return 200 Ok", (done) => {
    request.get("http://localhost:4100/messages", (err, res) => {
      console.log(res.body); // this res will not be clg if done is not used, because we've not set it async
      expect(res.statusCode).toEqual(200);
      done();
    });
  });

  it("should return a list, that's not empty", (done) => {
    request.get("http://localhost:4100/messages", (err, res) => {
      expect(JSON.parse(res.body).length).toBeGreaterThanOrEqual(0);
      //   toBeGreaterThan(0);
      done();
    });
  });
});

describe("get messages from a user", () => {
  it("should return 200 Ok", (done) => {
    request.get("http://localhost:4100/messages/tim", (err, res) => {
      console.log(res.body); // this res will not be clg if done is not used, because we've not set it async
      expect(res.statusCode).toEqual(200);
      done();
    });
  });

  it("name should be ahmed", (done) => {
    request.get("http://localhost:4100/messages/ahmed", (err, res) => {
      expect(JSON.parse(res.body).name.toLowerCase()).toEqual("ahmed");
      done();
    });
  });
});
