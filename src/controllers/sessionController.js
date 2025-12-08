import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserRepository from '../repositories/UserRepository.js';
import CartRepository from '../repositories/CartRepository.js';
import EmailService from '../services/emailService.js';
import { userDTO } from '../utils/dtos.js';

const userRepository = new UserRepository();
const cartRepository = new CartRepository();
const emailService = new EmailService();

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role = 'user' } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const cart = await cartRepository.create();
    
    const user = await userRepository.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      cart: cart._id
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userDTO(user)
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña requeridos' });
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({
      message: 'Login exitoso',
      token,
      user: userDTO(user)
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const current = async (req, res) => {
  try {
    const user = await userRepository.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario actual',
      user: userDTO(user)
    });
  } catch (error) {
    console.error('Error en current:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Sesión cerrada exitosamente' });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requerido' });
    }

    const user = await userRepository.findByEmail(email);
    
    if (user) {
      const token = crypto.randomBytes(20).toString('hex');
      const expires = Date.now() + 3600000;

      await userRepository.update(user._id, {
        resetToken: token,
        resetExpires: expires
      });

      await emailService.sendResetPasswordEmail(user.email, token);
    }

    res.json({ 
      message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' 
    });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Nueva contraseña requerida' });
    }

    const user = await userRepository.findByResetToken(token);
    
    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    const samePassword = await bcrypt.compare(password, user.password);
    if (samePassword) {
      return res.status(400).json({ 
        message: 'No puedes usar la misma contraseña anterior' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await userRepository.update(user._id, {
      password: hashedPassword,
      resetToken: undefined,
      resetExpires: undefined
    });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};