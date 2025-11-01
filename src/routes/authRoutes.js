const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.post('/register', (req, res) => AuthController.register(req, res));
router.post('/login', (req, res) => AuthController.login(req, res));
router.post('/refresh', (req, res) => AuthController.refresh(req, res))
router.post('/logout', (req, res) => AuthController.logout(req, res))
router.get("/user", (req, res) => AuthController.user(req, res));



module.exports = router;
