require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const auth = require("./middlewares/auth");

const {
  getUsers,
  getUser,
  getUserByEmail,
  addUser,
  authUser,
} = require("./controllers/user.controller");

const {
  addApplication,
  getApplications,
} = require("./controllers/application.controller");

const PORT = process.env.PORT || 7000;

const app = express();

app.use(express.static("../client/build"));

app.use(express.json());
app.use(cookieParser());

app.get("/users/:email", async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { token, user } = await addUser(req.body.email, req.body.password);
    res.cookie("token", token);
    res.send({ error: null, user });
  } catch (error) {
    if (error.code === 11000) {
      res.send({
        error: `Ошибка: E-mail "${error.keyValue.email}" уже используется`,
        token: null,
      });
      return;
    }
    res.send({ error: error.message });
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { token, user } = await authUser(req.body.email, req.body.password);
    res.cookie("token", token, { maxAge: 3600000, httpOnly: true });
    res.send({ error: null, user });
  } catch (error) {
    res.send({ error: error.message });
  }
});

app.post("/logout", async (req, res) => {
  res.cookie("token", "", { httpOnly: true }).send({});
});

app.get("/user", async (req, res) => {
  try {
    const userEmail = await getUser(req.cookies.token);
    res.send({ error: null, email: userEmail });
  } catch (error) {
    console.log(error);
    res.send({ error: error.message, user });
  }
});

app.use(auth);

app.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.send({ users });
  } catch (error) {
    console.log(error);
  }
});

app.post("/application", async (req, res) => {
  try {
    const application = await addApplication(
      req.body.date,
      req.body.name,
      req.body.phone,
      req.body.problem
    );
    res.send({ error: null, application });
  } catch (error) {
    res.send({ error, application: null });
    console.log(error);
  }
});

app.get("/applications", async (req, res) => {
  try {
    const { applications, lastPage } = await getApplications(
      req.query.search,
      req.query.limit,
      req.query.page
    );
    res.send({ error: null, data: { applications, lastPage } });
  } catch (err) {
    res.send({ error: err.message || "Unknown Error" });
  }
});

mongoose.connect(process.env.DB_URL).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
