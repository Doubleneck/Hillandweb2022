const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// eslint-disable-next-line no-unused-vars
let ADMINTOKEN = ''
let USERTOKEN = ''

beforeAll(async () => {
  await supertest(app)
    .post('/api/testing/reset')
    .expect(201)

  const userdata = {
    username: 'admin@admin.com',
    password: 'Admin@admin1',
  }
  const response = await supertest(app).post('/api/login').send(userdata)
  ADMINTOKEN = response.body.token

  const userdata2 = {
    username: 'user@user.com',
    password: 'User@user1',
  }
  const response2 = await supertest(app).post('/api/login').send(userdata2)
  USERTOKEN = response2.body.token

})


describe('GET s3 url when there is initially one admin-user and one user-user at db', () => {
  // test('getting  s3 url succees if logged as ADMIN ', async () => {
    
  //   await api
  //     .get('/api/s3url')
  //     .set('Authorization', `Bearer ${ADMINTOKEN}`)
  //     .expect(200)
  //     .expect('Content-Type', /application\/json/)
  // }) 

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


