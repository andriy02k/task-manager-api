import request from "supertest";
import mongoose from "mongoose";
import app from "./app.js";
import User from "./models/users.js";

const API_URL = "/api/users";

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    // Підключення до тестової бази даних
    await mongoose.connect(process.env.TEST_DB_URI);
  });

  afterEach(async () => {
    // Очищення бази даних після кожного тесту
    await User.deleteMany();
  });

  afterAll(async () => {
    // Закриття з'єднання з базою даних
    await mongoose.connection.close();
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      const newUser = {
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post(`${API_URL}/register`)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "Registration successfully" });

      const user = await User.findOne({ email: newUser.email });
      expect(user).not.toBeNull();
      expect(user.name).toBe(newUser.name);
    });

    it("should not register a user with an existing email", async () => {
      const existingUser = {
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      };

      await User.create(existingUser);

      const response = await request(app)
        .post(`${API_URL}/register`)
        .send(existingUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ message: "User already registered" });
    });
  });

  describe("POST /login", () => {
    it("should login a user and return a token", async () => {
      const user = {
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      };

      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.create({ ...user, password: hashedPassword });

      const response = await request(app)
        .post(`${API_URL}/login`)
        .send({ email: user.email, password: user.password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app)
        .post(`${API_URL}/login`)
        .send({ email: "wrong@example.com", password: "wrongpassword" });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Email or password is incorrect",
      });
    });
  });

  describe("GET /logout", () => {
    it("should logout a user", async () => {
      const user = {
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      };

      const hashedPassword = await bcrypt.hash(user.password, 10);
      const savedUser = await User.create({
        ...user,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { id: savedUser._id, name: savedUser.name },
        process.env.JWT_SECRET
      );

      await User.findByIdAndUpdate(savedUser._id, { token });

      const response = await request(app)
        .get(`${API_URL}/logout`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      const updatedUser = await User.findById(savedUser._id);
      expect(updatedUser.token).toBeNull();
    });

    it("should return 401 if user is not authenticated", async () => {
      const response = await request(app).get(`${API_URL}/logout`);
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Unauthorized" });
    });
  });
});
