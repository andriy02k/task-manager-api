// import request from "supertest";
// import mongoose from "mongoose";
// import app from "../app.js";
// import Tasks from "../models/tasks.js";
// import User from "../models/users.js";

// const API_URL = "/api/tasks";

// let token;
// let taskId;

// const userData = {
//   email: "testuser@example.com",
//   password: "password123",
// };

// const taskData = {
//   title: "Test Task",
//   body: "This is a test task body.",
// };

// beforeAll(async () => {
//   if (mongoose.connection.readyState !== 0) {
//     await mongoose.disconnect();
//   }
//   await mongoose.connect(process.env.TEST_DB_URI);

//   // Реєструємо нового користувача
//   const userResponse = await request(app)
//     .post("/api/users/register")
//     .send(userData);

//   // Перевірка, чи користувач був зареєстрований
//   expect(userResponse.status).toBe(201);
//   expect(userResponse.body).toHaveProperty("email", userData.email);

//   // Логінимося для отримання токена
//   const loginResponse = await request(app)
//     .post("/api/users/login")
//     .send(userData);

//   // Перевірка, чи отримано токен
//   expect(loginResponse.status).toBe(200);
//   expect(loginResponse.body).toHaveProperty("token");

//   token = loginResponse.body.token;
// });

// afterAll(async () => {
//   await Tasks.deleteMany({});
//   await User.deleteMany({});
//   await mongoose.connection.close();
// });

// describe("Tasks Endpoints", () => {
//   // Тест на створення завдання
//   it("should create a new task", async () => {
//     const response = await request(app)
//       .post(API_URL)
//       .set("Authorization", `Bearer ${token}`)
//       .send(taskData);

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("_id");
//     expect(response.body.title).toBe(taskData.title);
//     expect(response.body.body).toBe(taskData.body);

//     taskId = response.body._id; // Зберігаємо ID для подальших тестів
//   });

//   // Тест на отримання всіх завдань
//   it("should get all tasks for the user", async () => {
//     const response = await request(app)
//       .get(API_URL)
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toBeInstanceOf(Array);
//     expect(response.body[0]).toHaveProperty("title", taskData.title);
//   });

//   // Тест на отримання одного завдання
//   it("should get a single task by ID", async () => {
//     const response = await request(app)
//       .get(`${API_URL}/${taskId}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("_id", taskId);
//     expect(response.body.title).toBe(taskData.title);
//   });

//   // Тест на оновлення завдання
//   it("should update a task", async () => {
//     const updatedTaskData = {
//       title: "Updated Task Title",
//       body: "Updated task body.",
//     };

//     const response = await request(app)
//       .put(`${API_URL}/${taskId}`)
//       .set("Authorization", `Bearer ${token}`)
//       .send(updatedTaskData);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("_id", taskId);
//     expect(response.body.title).toBe(updatedTaskData.title);
//     expect(response.body.body).toBe(updatedTaskData.body);
//   });

//   // Тест на видалення завдання
//   it("should delete a task by ID", async () => {
//     const response = await request(app)
//       .delete(`${API_URL}/${taskId}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("_id", taskId);

//     // Перевірка, чи дійсно завдання було видалено
//     const checkTask = await request(app)
//       .get(`${API_URL}/${taskId}`)
//       .set("Authorization", `Bearer ${token}`);

//     expect(checkTask.status).toBe(404); // Завдання має бути не знайдено
//   });

//   // Тест на доступ до маршрутів без токена
//   it("should return 401 if no token is provided", async () => {
//     const response = await request(app).get(API_URL);
//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty("message", "Not authorized");
//   });
// });
