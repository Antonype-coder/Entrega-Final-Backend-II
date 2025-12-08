import User from '../models/User.js';

export default class UserManager {
  async create(userData) {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await User.findById(id).populate('cart');
    } catch (error) {
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await User.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async findByResetToken(token) {
    try {
      return await User.findOne({ 
        resetToken: token,
        resetExpires: { $gt: Date.now() }
      });
    } catch (error) {
      throw error;
    }
  }
}