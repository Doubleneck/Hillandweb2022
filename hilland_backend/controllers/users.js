const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { adminCredentialsValidator, userLoggedInValidator } = require('../utils/middleware')  

usersRouter.get('/', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {
  const { username, name, role, password } = await request.body

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'username and password must be at least three characters long',
    })
  }
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    role,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter
