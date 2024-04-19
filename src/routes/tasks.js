const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const tasks = await prisma.task.findMany();
  return res.status(200).json({ tasks });
});

router.patch("/", async (req, res) => {
  const { id, completed, title } = await req.body;
  try {
    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        completed,
        title,
      },
    });
    return res.status(200).json({ message: "Task updated", task })
  } catch (error) {}
});

router.post("/", async (req, res) => {
  const { title, userId } = await req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        userId,
      },
    });
    return res.status(200).json({ task });
  } catch (error) {
    console.error("Erro ao criar task", error);
    res.status(400).json({ error: "Erro ao criar task" });
  }
});

router.delete("/", async (req, res) => {
  const { id } = await req.body;
  try {
    const task = await prisma.task.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({ message: "Task deletada", task });
  } catch (error) {
    console.error("Erro ao apagar task", error);
    res.status(400).json({ error: "Erro ao apagar task" });
  }
});

module.exports = router;
