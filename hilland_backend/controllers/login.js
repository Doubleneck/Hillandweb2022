const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect =
    (await user) === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const token = jwt.sign(user.toJSON(), process.env.SECRET, {
    expiresIn: 60 * 60 ,
  })
  const fieldsToReturn = user.toJSON()
  fieldsToReturn.token = token
  response
    .status(200)
    .json(fieldsToReturn)

})

module.exports = loginRouter
