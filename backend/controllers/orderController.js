import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

import Logger from '../loaders/logger.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body

    if (orderItems && orderItems.length === 0) {

      res.status(400).json({
        status: 'failure',
        message: 'No order items',
        data: order
      });
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      })

      const createdOrder = await order.save()
      res.status(201).json({
        status: 'success',
        message: 'Order Created Successfully',
        data: createdOrder
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)

    res.status(500).json({
      status: 'failure',
      message: 'Unable to place your order due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (order) {

      res.status(200).json({
        status: 'success',
        message: 'Order Fetched Successfully',
        data: order
      });
    } else {

      res.status(404).json({
        status: 'failure',
        message: 'Order Not Found',
        data: order
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to get order info due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address
      }

      const updatedOrder = await order.save()
      res.status(200).json({
        status: 'success',
        message: 'Order Updated Successfully',
        data: updatedOrder
      });
    } else {

      res.status(404).json({
        status: 'failure',
        message: 'Order Not Found',
        data: order
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to update order info due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()
      const updatedOrder = await order.save()

      res.status(200).json({
        status: 'success',
        message: 'Order Successfully Updated As Delivered',
        data: updatedOrder
      });
    } else {
      res.status(404).json({
        status: 'failure',
        message: 'Order Not Found',
        data: order
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to update order as delivered due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.status(200).json({
    status: 'success',
    message: 'Orders Fetched Successfully',
    data: orders
  });
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.status(200).json({
    status: 'success',
    message: 'Orders Fetched Successfully',
    data: orders
  });
})

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
}
