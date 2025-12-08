import UserManager from '../dao/managers/UserManager.js';

const userManager = new UserManager();

export default class UserRepository {
  async create(userData) {
    return await userManager.create(userData);
  }

  async findByEmail(email) {
    return await userManager.findByEmail(email);
  }

  async findById(id) {
    return await userManager.findById(id);
  }

  async update(id, updateData) {
    return await userManager.update(id, updateData);
  }

  async findByResetToken(token) {
    return await userManager.findByResetToken(token);
  }
}