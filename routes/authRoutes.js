// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const validationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

// User registration route
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Endpoint for user registration.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful registration
 *         content:
 *           application/json:
 *             example:
 *               message: User registered successfully
 *               token: <JWT Token>
 *       400:
 *         description: Bad request or user already exists
 *         content:
 *           application/json:
 *             example:
 *               error: User with this email already exists
 */
router.post(
  '/register',
  [
    check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validationMiddleware,
  ],
  authController.registerUser
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Endpoint for user login.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               accessToken: <JWT Access Token>
 *               refreshToken: <JWT Refresh Token>
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid email or password
 */
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validationMiddleware,
  ],
  authController.login
);
router.post('/refresh-token', authController.refreshToken);

router.get('/test-error', authController.testError);

module.exports = router;
