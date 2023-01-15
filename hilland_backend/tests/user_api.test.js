const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const News = require('../models/news')
const bcrypt = require('bcrypt')
const User = require('../models/user')

let ADMINTOKEN = ''
let USERTOKEN = ''

beforeAll(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({
    username: 'root',
    role: 'admin',
    passwordHash,
  })
  await user.save()

  const userdata = {
    username: 'root',
    password: 'sekret',
  }
  const response = await supertest(app).post('/api/login').send(userdata)
  ADMINTOKEN = response.body.token

  const passwordHash2 = await bcrypt.hash('sekret2', 10)
  const user2 = new User({
    username: 'useruser',
    role: 'user',
    passwordHash2,
  })
  await user2.save()
  const userdata2 = {
    username: 'useruser',
    password: 'sekret2',
  }
  const response2 = await supertest(app).post('/api/login').send(userdata2)
  USERTOKEN = response2.body.token
})

describe('when there is initially one admin-user and one user-user at db', () => {
  test('There are two users at start', async () => {
    const usersAtStart = await helper.usersInDb()
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(usersAtStart.length)
  })
})

describe('creating new users when there is initially one admin-user and one user-user at db', () => {
  beforeEach(async () => {
    const passwordHash = await bcrypt.hash('sekret', 10)
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      role: 'user',
      password: passwordHash,
    }
  })

  test('creation fails if not logged', async () => {
    const usersAtStart = await helper.usersInDb()
    newUser = helper.newUser
    await api
      .post('/api/users')
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation succees with proper statuscode if ADMIN', async () => {
    const usersAtStart = await helper.usersInDb()
    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  })

  test('creation fails with proper statuscode if USER', async () => {
    const usersAtStart = await helper.usersInDb()
    newUser = helper.newUser
    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})
