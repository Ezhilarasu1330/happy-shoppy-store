import mongoose from "mongoose";

import Logger from '../loaders/logger.js';

const connectDB = async () => {

  const connection = await mongoose.connect(process.env.MONGO_URI, {
    keepAlive: true, useNewUrlParser: true, useCreateIndex: true,
    reconnectTries: 1000, reconnectInterval: 1000, autoReconnect: true, useFindAndModify: false, loggerLevel: 'info'
  });
  mongoose.connection.on('connecting', function () {
    Logger.info('connecting to MongoDB...');
  });

  mongoose.connection.on('error', function (error) {
    Logger.error('Error in MongoDb connection: ' + error);
  });
  mongoose.connection.on('connected', function () {
    Logger.info('MongoDB connected!');
  });
  mongoose.connection.on('open', function () {
    Logger.info('MongoDB connection opened!');
  });
  mongoose.connection.on('reconnected', function () {
    Logger.info('MongoDB reconnected!');
  });
  mongoose.connection.on('disconnected', function () {
    Logger.error("MongoDB disconnected!");
  });

  Logger.info(`Mongo database connected on ${connection.connection.host}`);
};

export default connectDB;
