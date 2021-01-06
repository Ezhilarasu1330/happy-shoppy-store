import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

import Logger from '../loaders/logger.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  Logger.info('Get All Products');
  let result = new Map();
  try {
    const keyword = req.query.keyword ? {
      name: {
        $regex: req.query.keyword,
        $options: 'i',
      },
    } : {}

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))

    let pageContext = {
      page: page,
      per_page: Math.ceil(count / pageSize),
      applied_filter: req.query.keyword ? req.query.keyword : ''
    }

    if (products.length > 0) {
      res.status(200).json({
        status: 'success',
        message: 'Products Fetched Successfully',
        data: products,
        page_context: pageContext
      });
    }
    else {

      res.status(200).json({
        status: 'success',
        message: 'Products Not Exist',
        data: products,
        page_context: pageContext
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)

    res.status(500).json({
      status: 'failure',
      message: 'Unable to get products due to internal error',
      errorSummary: error
    });

  }
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {

  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      res.status(200).json({
        status: 'success',
        message: 'Products Fetched Successfully',
        data: product
      });
    } else {

      res.status(404).json({
        status: 'failure',
        message: 'Products Not Found',
        data: product
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to get product info due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      await product.remove()
      res.status(200).json({
        status: 'success',
        message: 'Products Deleted Successfully',
        data: product
      });
    } else {

      res.status(404).json({
        status: 'failure',
        message: 'Products Not Found'
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to delete product due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {

  try {
    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'Sample brand',
      category: 'Sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample description',
    })

    const createdProduct = await product.save()
    if (createProduct) {
      res.status(201).json({
        status: 'success',
        message: 'Products Added Successfully',
        data: createdProduct
      });
    }
    else {
      res.status(201).json({
        status: 'failure',
        message: 'Unable to add product'
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to add product due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
      product.name = name
      product.price = price
      product.description = description
      product.image = image
      product.brand = brand
      product.category = category
      product.countInStock = countInStock

      const updatedProduct = await product.save()
      res.status(201).json({
        status: 'success',
        message: 'Products Updated Successfully',
        data: updatedProduct
      });
    } else {
      res.status(404).json({
        status: 'failure',
        message: 'Products Not Found'
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to update product due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      )

      if (alreadyReviewed) {
        res.status(400).json({
          status: 'success',
          message: 'Product already reviewed'
        });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      }

      product.reviews.push(review)
      product.numReviews = product.reviews.length
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
      await product.save()

      res.status(201).json({
        status: 'success',
        message: 'Review added successfully'
      });
    } else {
      res.status(404).json({
        status: 'failure',
        message: 'Product Not Found'
      });
    }
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to add review to a product due to internal error',
      errorSummary: error
    });
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)

    res.status(200).json({
      status: 'success',
      message: 'Products Fetched Successfully',
      data: products
    });
  }
  catch (error) {
    Logger.error(`${error}`)
    res.status(500).json({
      status: 'failure',
      message: 'Unable to get top products due to internal error',
      errorSummary: error
    });
  }



  res.json(products)
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
}
