const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})
usersRouter.post('/', async (request, response) => {
  const { username, name, role, password } = request.body
  const token = request.token 
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (request.user.role !== 'admin'){
    return response.status(401).json({ error: 'you don´t have rights for this operation' })
  }
  if (!(username && password)){
    return response.status(400).json({
      error: 'username and password must be given'
    })
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'username and password must be at least three characters long'
    })
  }
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
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