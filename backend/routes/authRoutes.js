const express = require('express');
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/userController');

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

// Register validation rules
const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Tên phải có ít nhất 2 ký tự')
];

// Login validation rules
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Vui lòng nhập mật khẩu')
];

// Routes
router.post('/register', registerValidation, validate, userController.register);
router.post('/login', loginValidation, validate, userController.login);

module.exports = router;
