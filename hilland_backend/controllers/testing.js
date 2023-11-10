const router = require('express').Router()
const User = require('../models/user')
const Songrequest = require('../models/songrequest')
const News = require('../models/news')
const helper = require('../test/test_helper')
const bcrypt = require('bcrypt')


// Test environment purpoeses only, resets db to a base state for testing
router.post('/reset', async (request, response) => {
  let savedUsers = []

  try {
    await User.deleteMany({})
    await Songrequest.deleteMany({})
    await News.deleteMany({})
    const testUsers = [helper.userUser(), helper.adminUser()]
    const saltRounds = 10
  
    
    for (let user of testUsers) {
      const passwordHash = await bcrypt.hash(user.password, saltRounds)
      user.passwordHash = passwordHash
      delete user.password
      const mongoUser = new User(user)
      const savedUser = await mongoUser.save()
      savedUsers = savedUsers.concat(savedUser)
    }
  
  } catch (error) {
    return response.status(400).json({ error: 'something went wrong while intializing users' })
  }
  
  response.status(201).json(savedUsers)
})

module.exports = router