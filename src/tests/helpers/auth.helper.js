import supertest from "supertest";
import app from "../../app.js";

const request = supertest(app);

export const registerAndLogin = async ({
  name = "Test User",
  email = `test_${Date.now()}@test.com`,
  password = "123456",
  role = "user",
} = {}) => {
  await request.post("/api/auth/register").send({ name, email, password });

  if (role === "admin") {
    const { default: User } = await import("../../models/user.model.js");

    await User.findOneAndUpdate({ email }, { role: "admin" });
  }

  const res = await request.post("/api/auth/login").send({
    email,
    password,
  });
  return {
    token: res.body.data.token,
    email,
    password,
  };
};

export const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});
