import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDBStatus } from '../config/db.js';

const router = express.Router();

// Temporary memory store if MongoDB is not connected
const memoryUsers = [];

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, preferredLanguage, district } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (getDBStatus()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        preferredLanguage: preferredLanguage || 'en',
        district: district || 'Colombo',
      });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, preferredLanguage: user.preferredLanguage, district: user.district },
      });
    } else {
      // Memory mode
      const existing = memoryUsers.find(u => u.email === email);
      if (existing) {
        return res.status(400).json({ message: 'User already exists with this email.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { id: `user_${Date.now()}`, name, email, password: hashedPassword, preferredLanguage: preferredLanguage || 'en', district: district || 'Colombo' };
      memoryUsers.push(newUser);

      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return res.status(201).json({
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, preferredLanguage: newUser.preferredLanguage, district: newUser.district },
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, preferredLanguage: user.preferredLanguage, district: user.district },
      });
    } else {
      // Memory mode
      const user = memoryUsers.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, preferredLanguage: user.preferredLanguage, district: user.district },
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Guest session initialization
router.post('/guest', (req, res) => {
  const guestId = `guest_${Math.random().toString(36).substring(2, 9)}`;
  const token = jwt.sign({ userId: guestId, isGuest: true }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({
    token,
    user: { id: guestId, name: 'Guest Citizen', isGuest: true, preferredLanguage: 'en', district: 'Colombo' },
  });
});

export default router;
