import express, { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'User Management API is running' });
});

// Create a user
app.post('/api/users', async (req: Request, res: Response) => {
  const { name, email, age } = req.body;
  if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim() || !Number.isInteger(age)) {
    return res.status(400).json({ error: 'name, email and integer age are required' });
  }

  try {
    const user = await prisma.user.create({
      data: { name: name.trim(), email: email.trim(), age },
    });
    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Could not create user' });
  }
});

// Get all users
app.get('/api/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not get users' });
  }
});

// Get one user by ID
app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && (error.code === 'P2023' || error.code === 'P2025')) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Could not get user' });
  }
});

// Update a user (any supplied fields)
app.patch('/api/users/:id', async (req: Request, res: Response) => {
  const { name, email, age } = req.body;
  const data: { name?: string; email?: string; age?: number } = {};
  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) return res.status(400).json({ error: 'name must be a non-empty string' });
    data.name = name.trim();
  }
  if (email !== undefined) {
    if (typeof email !== 'string' || !email.trim()) return res.status(400).json({ error: 'email must be a non-empty string' });
    data.email = email.trim();
  }
  if (age !== undefined) {
    if (!Number.isInteger(age)) return res.status(400).json({ error: 'age must be an integer' });
    data.age = age;
  }
  if (Object.keys(data).length === 0) return res.status(400).json({ error: 'Provide at least one field to update' });

  try {
    const user = await prisma.user.update({ where: { id: req.params.id }, data });
    return res.json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'User not found' });
      if (error.code === 'P2002') return res.status(409).json({ error: 'A user with this email already exists' });
      if (error.code === 'P2023') return res.status(400).json({ error: 'Invalid user ID' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Could not update user' });
  }
});

// Delete a user
app.delete('/api/users/:id', async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return res.status(404).json({ error: 'User not found' });
      if (error.code === 'P2023') return res.status(400).json({ error: 'Invalid user ID' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Could not delete user' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
