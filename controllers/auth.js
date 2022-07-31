const ErrorResponse = require('../utils/errorResponse');

const asyncHandler = require('../middleware/async');
const userModel = require('../models/User');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public

exports.register = asyncHandler(async (req, res, next) => {
  const { fullname, username, email, password } = req.body;

  const hashPassword = await userModel.hashPassword(password);

  var today = new Date();
  var date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  const isUserExist = await userModel.getUsers({
    where: `username='${username}'`,
  });

  const isEmailExist = await userModel.getUsers({
    where: `email='${email}'`,
  });

  if (!fullname || !email || !password) {
    return res.status(401).json({
      success: false,
      error: `Please fill all the required fields`,
    });
  }

  if (isUserExist[0].length <= 0) {
    if (isEmailExist[0].length >= 1) {
      return res.status(401).json({
        success: false,
        error: `${email} is already used by someone else try different email`,
      });
    }
    const user = await userModel.createUser({
      fullname,
      username: username || Date.now(),
      email,
      password: hashPassword,
      created_at: date,
      updated_at: date,
    });

    if (user) {
      const user = await userModel.getUsers({
        where: `username='${username}' AND password='${hashPassword}'`,
      });

      sendTokenResponse(user[0], 200, res);
    } else {
      return res.status(401).json({
        success: false,
        error: `Failed to add the user, something went wrong`,
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: `${username} is already taken by someone else try different username`,
    });
  }
});

// @desc    Login a user
// @route   POST /api/v1/auth/login
// @access  Public

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username && !password) {
    return res.status(401).json({
      success: false,
      error: `Please provide email/username and password`,
    });
  }

  const isUserExist = await userModel.getUsers({
    where: `username='${username}'`,
  });

  if (isUserExist[0].length > 0) {
    const isMatch = await userModel.matchPassword(
      password,
      isUserExist[0][0]['password']
    );

    if (isMatch) {
      sendTokenResponse(isUserExist[0], 200, res);
    } else {
      return res.status(401).json({
        success: false,
        error: `Invalid credentials`,
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: `Invalid credentials`,
    });
  }
});

// @desc    Forget Password
// @route   POST /api/v1/auth/forget-password
// @access  Public

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return req.status(401).json({
      success: false,
      error: `Please provide correct username/Email address`,
    });
  }

  const isUserExist = await userModel.getUsers({
    where: `(username='${username}' OR email='${username}')`,
  });

  if (isUserExist[0].length > 0) {
    console.log(isUserExist[0]);

    var date = new Date();
    date.setDate(date.getDate() + 7); // Valid for 7 Days since request for password
    date =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    const update = await userModel.updateUser({
      data: {
        resetPasswordCode: Math.floor(100000 + Math.random() * 900000),
        resetPasswordExpires: date,
      },
      where: `id=${isUserExist[0][0]['id']}`,
    });

    if (update) {
      return res.status(201).json({
        success: true,
        message: `Your password Code has been sent to your email address`,
      });
    }
    return res.status(401).json({
      success: false,
      message: `Something went wrong, try again later`,
    });
  } else {
    return res.status(401).json({
      success: false,
      error: `Please provide correct username/Email address`,
    });
  }
});

// @desc    Set Forget Password
// @route   POST /api/v1/auth/set-forget-password
// @access  Public

exports.setForgetPassword = asyncHandler(async (req, res, next) => {
  const { resetPasswordCode, username, password } = req.body;
  const hashPassword = await userModel.hashPassword(password);
  var today = new Date();
  var date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getDate() +
    ' ' +
    today.getHours() +
    ':' +
    today.getMinutes() +
    ':' +
    today.getSeconds();

  if (!resetPasswordCode || !username || !password) {
    return res.status(401).json({
      success: false,
      error: `Please provide all the required filed`,
    });
  }

  const isUserExist = await userModel.getUsers({
    where: `(username='${username}' OR email='${username}') AND resetPasswordCode='${resetPasswordCode}' AND resetPasswordExpires >= '${date}' `,
  });

  console.log(isUserExist[0][0], date);

  if (isUserExist[0][0]) {
    const update = await userModel.updateUser({
      data: {
        password: hashPassword,
        updated_at: date,
      },
      where: `id=${isUserExist[0][0]['id']}`,
    });

    if (update) {
      return res.status(201).json({
        success: true,
        message: `Password updated successfully, Please login with your credentials `,
      });
    }

    return res.status(401).json({
      success: false,
      message: `Something went wrong,Please try again`,
    });
  }

  return res.status(401).json({
    success: false,
    message: `Please check your credentials and try again`,
  });
});
const sendTokenResponse = async (user, statusCode, res) => {
  const token = await userModel.getSignJwtToken(user[0]['id']);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 20 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  return res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
