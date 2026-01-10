const express = require('express');
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: errors.array()
        });
    }
    next();
};

// Update profile validation
const updateProfileValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Tên phải có ít nhất 2 ký tự'),
    body('avatar')
        .optional()
        .custom((value) => {
            // Allow empty string or null
            if (!value || value === '') return true;
            // Validate URL if provided
            try {
                new URL(value);
                return true;
            } catch {
                throw new Error('Avatar phải là URL hợp lệ');
            }
        })
];

// Change password validation
const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Vui lòng nhập mật khẩu hiện tại'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
];

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, validate, userController.updateProfile);
router.put('/password', changePasswordValidation, validate, userController.changePassword);
router.delete('/profile', userController.deleteAccount);
router.get('/', userController.getAllUsers);

module.exports = router;
