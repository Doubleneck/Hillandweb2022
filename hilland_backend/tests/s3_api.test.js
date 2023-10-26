const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
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

console.log('ADMINTOKEN', ADMINTOKEN)
describe('GET s3 url when there is initially one admin-user and one user-user at db', () => {
  test('getting  s3 url succees if logged as ADMIN ', async () => {
    
    await api
      .get('/api/s3url')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }) 

  test('getting  s3 url fails if not loggedin ', async () => {
    await api
      .get('/api/s3url')
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('getting  s3 url fails if logged as USER ', async () => {
    await api
      .get('/api/s3url')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})


