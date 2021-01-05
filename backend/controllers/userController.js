import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

import Logger from '../loaders/logger.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
      let userInfo = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      }

      res.status(200).json({
        status: 'success',
        message: 'User Loggedin Successfully',
        data: userInfo
      });

    } else {
      res.status(401).json({
        status: 'failure',
        message: 'Invalid email or password'
      });
    }
  }
  catch (error) {

    console.log('error :', error);

    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to login due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {

      res.status(400).json({
        status: 'failure',
        message: 'User already exists'
      });
    }

    const user = await User.create({ name, email, password })
    if (user) {
      let userInfo = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      }

      res.status(201).json({
        status: 'success',
        message: 'User Signup Successfully',
        data: userInfo
      });

    } else {

      res.status(400).json({
        status: 'failure',
        message: 'Invalid user data'
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to signup due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (user) {
      let userInfo = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      }

      res.status(200).json({
        status: 'success',
        message: 'User Info Fetched Successfully',
        data: userInfo
      });

    } else {
      res.status(404).json({
        status: 'success',
        message: 'User not found'
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to get user info due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) {
        user.password = req.body.password
      }
      const updatedUser = await user.save()
      let userInfo = {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      }

      res.status(200).json({
        status: 'success',
        message: 'User Info Updated Successfully',
        data: userInfo
      });
    } else {
      res.status(404).json({
        status: 'success',
        message: 'User not found'
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to update user info due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).json({
      status: 'success',
      message: 'Users List Fetched Successfully',
      data: users
    });
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to get users list due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      await user.remove()
      res.status(200).json({
        status: 'success',
        message: 'User deleted successfully'
      });
    } else {
      res.status(404).json({
        status: 'success',
        message: 'User not found'
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to delete user due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
      res.status(200).json({
        status: 'success',
        message: 'User Info Fetched Successfully',
        data: user
      });

    } else {
      res.status(404).json({
        status: 'success',
        message: 'User not found'
      });
    }
  } catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to get user info to internal error',
      errorSummary: error
    });
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = req.body.isAdmin

      const updatedUser = await user.save()
      let userInfo = {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      }

      res.status(200).json({
        status: 'success',
        message: 'User Info Updated Successfully',
        data: userInfo
      });

    } else {
      res.status(404).json({
        status: 'failure',
        message: 'User not found'
      });
    }
  } catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to update user info due to internal error',
      errorSummary: error
    });
  }
})

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
