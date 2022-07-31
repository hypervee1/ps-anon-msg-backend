const messageModel = require('../models/Messages');
const userModel = require('../models/User');

// @desc    Get all Messages
// @route   GET /api/v1/messages
// @access  Private

exports.getMessages = async (req, res, next) => {
  const user = req._user;

  const messages = await messageModel.getMessages({
    where: `user_id=${user} AND deleted_at IS NULL`,
  });

  if (messages[0]) {
    return res.status(200).json({
      count: messages[0].length || 0,
      success: true,
      msg: messages[0] || null,
      message: `All the messages sent to you`,
    });
  } else {
    return res.status(200).json({
      success: true,
      message: `No messages for you yet`,
    });
  }
};

// @desc    Get single Message
// @route   GET /api/v1/messages/:id
// @access  Private
exports.getMessage = async (req, res, next) => {
  const { id } = req.params;
  const user = req._user;

  const message = await messageModel.getMessage({
    where: `id='${id}' AND user_id='${user}' AND deleted_at IS NULL`,
  });

  if (message[0][0]) {
    return res.status(200).json({
      success: true,
      msg: message[0][0] || '',
    });
  } else {
    return res.status(401).json({
      success: false,
      error: `Something went wrong`,
    });
  }
};

// @desc    Create new message
// @route   POST /api/v1/messages
// @access  Public

exports.createMessages = async (req, res, next) => {
  const { user, message } = req.body;

  var today = new Date();
  var date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  const isUserExist = await userModel.getUsers({
    where: `username='${user}'`,
  });

  console.log(isUserExist[0][0]);
  if (isUserExist[0][0]) {
    const messages = messageModel.createMessage({
      user_id: isUserExist[0][0]['id'],
      message: message,
      created_at: date,
      updated_at: date,
    });

    if (!messages) {
      return res.status(200).json({
        success: false,
        error: `Something went wrong, failed to sent the message, try again please`,
      });
    } else {
      return res.status(201).json({
        success: true,
        msg: `Message has been sent successfully`,
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: `Something went wrong, please try again later`,
    });
  }
};

// @desc    Delete Message
// @route   DELETE /api/v1/messages
// @access  Private

exports.deleteMessages = async (req, res, next) => {
  const { id } = req.params;
  const user = req._user;

  var today = new Date();
  var date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  const update = messageModel.removeMessage({
    where: `id=${id} AND user_id='${user}' AND deleted_at IS NULL`,
    data: { deleted_at: date },
  });

  if (update) {
    return res.status(200).json({
      success: true,
      message: `Message has been removed successfully`,
    });
  } else {
    return res.status(401).json({
      success: false,
      error: `Something went wrong, please try again later`,
    });
  }
};
