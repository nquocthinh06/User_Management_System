const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Token expiry time (7 days)
const TOKEN_EXPIRY = '7d';

const userController = {
    // Register new user
    register: async (req, res) => {
        try {
            const { email, password, name } = req.body;

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã được sử dụng'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const user = await User.create({
                email,
                password: hashedPassword,
                name
            });

            // Generate token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: TOKEN_EXPIRY }
            );

            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        avatar: user.avatar,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email hoặc mật khẩu không đúng'
                });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Email hoặc mật khẩu không đúng'
                });
            }

            // Generate token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: TOKEN_EXPIRY }
            );

            res.json({
                success: true,
                message: 'Đăng nhập thành công',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        avatar: user.avatar,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Get current user profile
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy người dùng'
                });
            }

            res.json({
                success: true,
                data: { user }
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Update user profile
    updateProfile: async (req, res) => {
        try {
            const { name, avatar } = req.body;

            const user = await User.update(req.user.id, { name, avatar });

            res.json({
                success: true,
                message: 'Cập nhật thành công',
                data: { user }
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Change password
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;

            // Get user with password
            const user = await User.findByEmail(req.user.email);

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Mật khẩu hiện tại không đúng'
                });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password
            await User.updatePassword(req.user.id, hashedPassword);

            res.json({
                success: true,
                message: 'Đổi mật khẩu thành công'
            });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Delete account
    deleteAccount: async (req, res) => {
        try {
            const deleted = await User.delete(req.user.id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy người dùng'
                });
            }

            res.json({
                success: true,
                message: 'Xóa tài khoản thành công'
            });
        } catch (error) {
            console.error('Delete account error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    },

    // Get all users (admin only)
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll();

            res.json({
                success: true,
                data: { users }
            });
        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    }
};

module.exports = userController;
