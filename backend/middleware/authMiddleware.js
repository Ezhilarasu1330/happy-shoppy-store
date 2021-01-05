import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      res.status(401).json({
        status: 'failure',
        message: 'Unauthorized'
      });
    }
  }

  if (!token) {

    res.status(401).json({
      status: 'failure',
      message: 'Unauthorized - No Token'
    });
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {

    res.status(401).json({
      status: 'failure',
      message: 'You are unauthorized to perform this operation. Please contact your admin'
    });
  }
}

export { protect, admin }
