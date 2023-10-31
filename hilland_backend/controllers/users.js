const usersRouter = require('express').Router()
const validator = require('validator')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { adminCredentialsValidator, userLoggedInValidator } = require('../utils/middleware')  

usersRouter.get('/', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

// usersRouter.post('/', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {
//   const { username, name, role, password } = await request.body

//   if (username.length < 3 || password.length < 3) {
//     return response.status(400).json({
//       error: 'username and password must be at least three characters long',
//     })
//   }
//   const existingUser = await User.findOne({ username })
//   if (existingUser) {
//     return response.status(400).json({
//       error: 'username must be unique',
//     })
//   }
//   const saltRounds = 10
//   const passwordHash = await bcrypt.hash(password, saltRounds)
//   const user = new User({
//     username,
//     name,
//     role,
//     passwordHash,
//   })

//   const savedUser = await user.save()
//   response.status(201).json(savedUser)
// })

// Admin only, POST new user to db only if user creation field requirements and validations are fullfilled
usersRouter.post('/', adminCredentialsValidator, async (request, response) => {

  const user = await request.body

  if (!(user.username && user.password)) {
    return response.status(400).json({
      error: 'username and password must be given',
    })
  }

  if (!validator.isStrongPassword(user.password, {
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumbers: 1,
    minSymbols: 1 })) {
    return response.status(400).json({
      error: 'password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one symbol'
    })
  }

  const existingUser = await User.findOne({ username: user.username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    })
  }

  const saltRounds = 10
  user.passwordHash = await bcrypt.hash(user.password, saltRounds)
  delete user.password
  const userToSave = new User(user)
  const savedUser = await userToSave.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter
