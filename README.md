# Happy Shoppy eCommerce Application

# Welcome to ShopPoint! ✨

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://happy-shoppy.herokuapp.com/)&nbsp;[![Build passing](https://img.shields.io/badge/Build-Passing-brightgreen.svg?style=flat-square)](https://happy-shoppy.herokuapp.com/)&nbsp;[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)](https://foodeazy.herokuapp.com/)&nbsp;[![License](https://img.shields.io/badge/license-MIT-brightgreen)]

**Project Link** - ***https://happy-shoppy.herokuapp.com/***

> eCommerce platform built with the MERN stack & Redux.

## Features Handled

- Admin user controls
- Admin product management
- Admin order management
- User Login & SignUp
- Product list page and details page
- Product reviews and ratings
- Top products carousel
- Pagination
- Product search
- Users and their orders
- Update order as delivered
- Shipping process
- PayPal payment process
- Database seeder (products & users)

## Tech

- [Node.js](https://nodejs.org/en/)
- [React.js](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Material UI](https://material-ui.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)

## API :

- [PayPal API](https://developer.paypal.com/)

## Installation :zap:

**1. Clone this repo by running the following command :-**

```bash
 git clone https://github.com/Ezhilarasu1330/happy-shoppy-store.git
 cd happy-shoppy-store
```

**2. Now install all the required packages (frontend & backend) by running the following commands :-**

```
yarn add
cd client
yarn add
```

**3. Create a .env file in config folder and add the following**

```
PORT=5000
NODE_ENV=development

MONGO_URI =your mongodb uri

PAYPAL_CLIENT_ID=your paypal client id

JWT_SECRET=your key
JWT_EXPIREIN=30d

```

**3. Seed Database**

```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```

**4. Now start the react and node server by running the following command :-**

```
#Start the server & client
yarn run dev
```

**5.** **🎉 Open your browser and go to `https://localhost:5000`**

## 🤩 Don't forget to give this repo a ⭐ if you like this repo and want to appreciate our efforts
