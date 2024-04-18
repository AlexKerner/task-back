const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(400).json({ error: "Usuário não encontrado" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Senha inválida" });
    }
    const token = jwt.sign({ userId: user.id }, 'my_secret_key', { expiresIn: '5h' });
    res.status(200).json({ message: "Login bem sucedido", user, token });
  } catch (error) {}
});


router.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Lembre-se de criptografar a senha antes de salvar no banco de dados
      },
    });
    // Gerar token de acesso
    const token = jwt.sign({ userId: newUser.id }, 'my_secret_key', { expiresIn: '5h' });

    res.status(200).json({ message: "Usuário registrado com sucesso", newUser, accessToken: token });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(400).json({ error: "Erro ao registrar usuário" });
  }
});

router.delete("/auth/:id", async (req, res) => {
  const { id } = req.params; // Pegando o parâmetro de rota (ID)
  try {
    const user = await prisma.user.delete({
      where: {
        id: parseInt(id), // Convertendo o ID para um número inteiro, se necessário
      },
    });
    return res.status(200).json({ message: "Usuário deletado", user });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

router.get("/auth/users", async (req, res) => {
  const usersWithTasks = await prisma.user.findMany({
    include: {
      tasks: true // Carrega as tarefas relacionadas a cada usuário
    }
  })
  return res.status(200).json({ usersWithTasks })
})

module.exports = router;