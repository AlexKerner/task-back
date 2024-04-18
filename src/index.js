const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth");
const tasksRoutes = require("./routes/tasks");
app.use(express.json());

app.use(cors());

app.use("/auth", authRoutes);
app.use("/tasks", tasksRoutes)

