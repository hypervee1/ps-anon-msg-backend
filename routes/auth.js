const express = require('express');
const {
  register,
  login,
  forgetPassword,
  setForgetPassword,
} = require('../controllers/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/set-forget-password', setForgetPassword);

module.exports = router;
