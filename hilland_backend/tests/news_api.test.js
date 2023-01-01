const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const News = require('../models/news')

const initialNews = [
  {
    title: 'Test news #1',
    content: 'HTML is easy',
    date: new Date(),
    url: 'www.testnews.com',
    image: ''
  },
  {
    title: 'Test news #2',  
    content: 'NOTHING is easy',
    date: new Date(),
    url: 'www.testnews2.com',
    image: ''
  },
]

beforeEach(async () => {
  await News.deleteMany({})
  let newsObject = new News(initialNews[0])
  await newsObject.save()
  newsObject = new News(initialNews[1])
  await newsObject.save()
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

afterAll(() => {
  mongoose.connection.close()
})