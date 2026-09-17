const UserModel = require('../models/userModel');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json({ success: true, data: users });
    } catch (error) {
      console.error('[UserController Error]', error);
      res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const { name, email, avatarUrl } = req.body;
      if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Name and email are required' });
      }

      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const newUser = await UserModel.create({ name, email, avatarUrl });
      res.status(201).json({ success: true, data: newUser, message: 'User created successfully' });
    } catch (error) {
      console.error('[UserController Error]', error);
      res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
    }
  }
}

module.exports = UserController;
