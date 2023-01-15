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

describe('when there is initially some news saved', () => {
  beforeEach(async () => {
    await News.deleteMany({})
    await News.insertMany(helper.initialNews)
  })

  test('news are returned as json', async () => {
    await api
      .get('/api/news')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two news', async () => {
    const response = await api.get('/api/news')
    expect(response.body).toHaveLength(2)
  })

  test('the first news is about HTTP methods', async () => {
    const response = await api.get('/api/news')
    expect(response.body[0].content).toBe('HTML is easy')
  })

  test('all news are returned', async () => {
    const response = await api.get('/api/news')
    expect(response.body).toHaveLength(helper.initialNews.length)
  })

  test('a specific news is within the returned news', async () => {
    const response = await api.get('/api/news')
    const contents = response.body.map((r) => r.content)
    expect(contents).toContain('NOTHING is easy')
  })
})

describe('viewing a specific news', () => {
  test('success with valid id without login', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToView = newsAtStart[0]
    const resultNews = await api
      .get(`/api/news/${newsToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedNewsToView = JSON.parse(JSON.stringify(newsToView))
    expect(resultNews.body).toEqual(processedNewsToView)
  })

  test('fails with statuscode 404 if news does not exist without login', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api.get(`/api/news/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 if id is invalid without login', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    await api.get(`/api/news/${invalidId}`).expect(400)
  })
})

describe('addition of a new news', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await News.deleteMany({})
    await News.insertMany(helper.initialNews)
  })

  test('succeeds with valid data if ADMIN', async () => {
    const newNews = helper.newNews
    await api
      .post('/api/news')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send(newNews)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/news')
    const contents = response.body.map((r) => r.content)

    expect(response.body).toHaveLength(helper.initialNews.length + 1)
    expect(contents).toContain('Added this news')
  })

  test('fails with valid data if USER', async () => {
    const newNews = helper.newNews
    await api
      .post('/api/news')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send(newNews)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/news')
    const contents = response.body.map((r) => r.content)

    expect(response.body).toHaveLength(helper.initialNews.length)
  })

  test('fails with status code 400 if not content if ADMIN', async () => {
    const emptyContentNews = {
      title: 'Test news content missing',
      date: new Date(),
      url: 'www.testnews3.com',
      image: '',
    }
    await api
      .post('/api/news')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send(emptyContentNews)
      .expect(400)

    const response = await api.get('/api/news')
    expect(response.body).toHaveLength(helper.initialNews.length)
  })
})

describe('deleting and updating of a news', () => {
  beforeEach(async () => {
    await News.deleteMany({})
    let newsObject = new News(helper.initialNews[0])
    await newsObject.save()
    newsObject = new News(helper.initialNews[1])
    await newsObject.save()
  })

  test('deleting a news succees if ADMIN', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToDelete = newsAtStart[0]
    await api
      .delete(`/api/news/${newsToDelete.id}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(204)

    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd).toHaveLength(helper.initialNews.length - 1)
    const contents = newsAtEnd.map((r) => r.content)
    expect(contents).not.toContain(newsToDelete.content)
  })

  test('deleting a news fails if USER', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToDelete = newsAtStart[0]
    await api
      .delete(`/api/news/${newsToDelete.id}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(401)

    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd).toHaveLength(helper.initialNews.length)
  })

  test('deleting a news fails if not login', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToDelete = newsAtStart[0]
    await api.delete(`/api/news/${newsToDelete.id}`).expect(401)
    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd).toHaveLength(helper.initialNews.length)
  })

  test('updating a news succees if ADMIN', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToUpdate = newsAtStart[0]
    newsToUpdate.content = 'Updated content'
    await api
      .put(`/api/news/${newsToUpdate.id}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send(newsToUpdate)
      .expect(200)

    const newsAtEnd = await helper.newsInDb()

    expect(newsAtEnd[0].content).toEqual('Updated content')
    expect(newsAtEnd).toHaveLength(helper.initialNews.length)
  })

  test('updating a news fails if USER', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToUpdate = newsAtStart[0]
    newsToUpdate.content = 'Updated content'
    await api
      .put(`/api/news/${newsToUpdate.id}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send(newsToUpdate)
      .expect(401)

    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd[0].content).not.toEqual('Updated content')
    expect(newsAtEnd).toHaveLength(helper.initialNews.length)
  })

  test('updating a news fails if not login', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToUpdate = newsAtStart[0]
    newsToUpdate.content = 'Updated content'
    await api.put(`/api/news/${newsToUpdate.id}`).send(newsToUpdate).expect(401)

    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd[0].content).not.toEqual('Updated content')
    expect(newsAtEnd).toHaveLength(helper.initialNews.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
