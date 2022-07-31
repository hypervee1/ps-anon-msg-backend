const express = require('express');
const { protect } = require('../middleware/auth');

const {
  getMessages,
  createMessages,
  getMessage,
  deleteMessages,
} = require('../controllers/messages');
const router = express.Router();

router.route('/').get(protect, getMessages).post(createMessages);
router.route('/:id').get(protect, getMessage).delete(protect, deleteMessages);
module.exports = router;
