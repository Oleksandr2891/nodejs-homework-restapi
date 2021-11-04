const { authorize } = require("./users.middleware");
const User = require("./users.model");
const jwt = require("jsonwebtoken");
const secret = "test_secret";
const config = { getConfig: () => ({ jwt: { secret } }) };
jest.mock("../../config", () => config);

describe("Auth middleware test suite", () => {
  describe("When token was not provided", () => {
    const req = {
      get: jest.fn(),
    };
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    const next = jest.fn();

    beforeAll(() => {
      jest.spyOn(res, "status").mockReturnThis();
      jest.spyOn(User, "findById").mockImplementation();

      authorize()(req, res, next);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call req.get", () => {
      expect(req.get).toBeCalledTimes(1);
      expect(req.get).toBeCalledWith("Authorization");
    });

    it("Should not call User.findById", () => {
      expect(User.findById).not.toBeCalled();
    });

    it("Should not call next", () => {
      expect(next).not.toBeCalled();
    });

    it("should call res.status", () => {
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(401);
    });

    it("should call res.send", () => {
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith();
    });
  });

  describe("When provided token is wrong", () => {
    const req = {
      get: jest.fn(),
    };
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    const next = jest.fn();

    beforeAll(() => {
      jest.spyOn(req, "get").mockReturnValue("asdfasdfsdf");
      jest.spyOn(res, "status").mockReturnThis();
      jest.spyOn(User, "findById").mockImplementation();

      authorize()(req, res, next);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call req.get", () => {
      expect(req.get).toBeCalledTimes(1);
      expect(req.get).toBeCalledWith("Authorization");
    });

    it("Should not call User.findById", () => {
      expect(User.findById).not.toBeCalled();
    });

    it("Should not call next", () => {
      expect(next).not.toBeCalled();
    });

    it("should call res.status", () => {
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(401);
    });

    it("should call res.send", () => {
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith();
    });
  });

  describe("When user from token was not found", () => {
    const req = {
      get: jest.fn(),
    };
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    const next = jest.fn();

    const userId = 1;

    beforeAll(() => {
      const token = jwt.sign({ sub: userId }, secret);

      jest.spyOn(req, "get").mockReturnValue(`Bearer ${token}`);
      jest.spyOn(res, "status").mockReturnThis();
      jest.spyOn(User, "findById").mockImplementation();

      authorize()(req, res, next);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call req.get", () => {
      expect(req.get).toBeCalledTimes(1);
      expect(req.get).toBeCalledWith("Authorization");
    });

    it("Should call User.findById", () => {
      expect(User.findById).toBeCalledTimes(1);
      expect(User.findById).toBeCalledWith(userId);
    });

    it("Should not call next", () => {
      expect(next).not.toBeCalled();
    });

    it("should call res.status", () => {
      expect(res.status).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(401);
    });

    it("should call res.send", () => {
      expect(res.send).toBeCalledTimes(1);
      expect(res.send).toBeCalledWith();
    });
  });

  describe("When everything is ok", () => {
    const req = {
      get: jest.fn(),
    };
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    };
    const next = jest.fn();

    const userId = 1;
    const user = { token: null };

    beforeAll(() => {
      const token = jwt.sign({ sub: userId }, secret);
      user.token = token;
      jest.spyOn(req, "get").mockReturnValue(`Bearer ${token}`);
      jest.spyOn(res, "status").mockReturnThis();
      jest.spyOn(User, "findById").mockResolvedValue(user);

      authorize()(req, res, next);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call req.get", () => {
      expect(req.get).toBeCalledTimes(1);
      expect(req.get).toBeCalledWith("Authorization");
    });

    it("Should call User.findById", () => {
      expect(User.findById).toBeCalledTimes(1);
      expect(User.findById).toBeCalledWith(userId);
    });

    it("Should set user property for req", () => {
      expect(req.user).toEqual(user);
    });

    it("Should call next", () => {
      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith();
    });

    it("should not call res.status", () => {
      expect(res.status).not.toBeCalled();
    });

    it("should not call res.send", () => {
      expect(res.send).not.toBeCalled();
    });
  });
});
