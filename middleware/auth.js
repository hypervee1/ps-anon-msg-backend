const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const userModel = require('../models/User');
const asyncHandler = require('./async');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: `Not authorize to access this route`,
    });
  }

  console.log(token);

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isUserExist = await userModel.getUsers({
      where: `id=${decoded['id']}`,
    });

    console.log(isUserExist);

    if (isUserExist[0][0]['id']) {
      req._user = isUserExist[0][0]['id'];
      req._userInfo = isUserExist[0][0];
    } else {
      return res.status(401).json({
        success: false,
        error: `Not authorize to access this route`,
      });
    }

    console.log(isUserExist);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: `Not authorize to access this route`,
    });
  }
});
