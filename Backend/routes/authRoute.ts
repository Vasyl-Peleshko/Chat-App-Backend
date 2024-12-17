import express from 'express';
import { signupUser, signinUser, getUserByName } from '../controllers/authController';

const router = express.Router();

// Маршрути
router.post('/signup', signupUser);
router.post('/login', signinUser);
router.post('/getUserByName', getUserByName);

export default router;
