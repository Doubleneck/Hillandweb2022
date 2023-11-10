const usersRouter = require('express').Router()
const validator = require('validator')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { adminCredentialsValidator, userLoggedInValidator } = require('../utils/middleware')  

usersRouter.get('/', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

// Admin only, POST new user to db only if user creation field requirements and validations are fullfilled
usersRouter.post('/', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {

  try {
    const { username, password } = request.body

    if (!username || !password) {
      return response.status(400).json({ error: 'Username and password must be provided' })
    }

    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minLowerCase: 1,
      minUpperCase: 1,
      minNumbers: 1,
      minSymbols: 1 })) {
      return response.status(400).json({
        error: 'password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one symbol'
      })
    }

    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return response.status(400).json({ error: 'username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      username,
      passwordHash,
    })

    const savedUser = await newUser.save()
    return response.status(201).json(savedUser)
  } catch (error) {
    
    return response.status(500).json({ error: 'Internal Server Error' })
  }
})


usersRouter.delete('/:id', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {
  try {
    const id = request.params.id
    if (!id || !validator.isMongoId(id)) {
      return response.status(400).json({ error: 'Invalid user ID' })
    }

    const userToDelete = await User.findById(id)
    if (!userToDelete) {
      return response.status(404).json({ error: 'User not found' })
    }

    await User.findByIdAndRemove(id)
    return response.status(200).json({ message: 'user was deleted successfully' })
    
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Internal Server Error' })
  }
})
module.exports = usersRouter
