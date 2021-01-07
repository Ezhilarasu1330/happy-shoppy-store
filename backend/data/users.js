import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'adminuser@yopmail.com',
    password: bcrypt.hashSync('12345678', 10),
    isAdmin: true,
  },
  {
    name: 'Demo User 1',
    email: 'demouser1@yopmail.com',
    password: bcrypt.hashSync('12345678', 10),
  },
  {
    name: 'Demo User 2',
    email: 'demouser2@yopmail.com',
    password: bcrypt.hashSync('12345678', 10),
  },
]

export default users
