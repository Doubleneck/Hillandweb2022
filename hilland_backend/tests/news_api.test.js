const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const News = require('../models/news')

beforeEach(async () => {
  await News.deleteMany({})
  let newsObject = new News(helper.initialNews[0])
  await newsObject.save()
  newsObject = new News(helper.initialNews[1])
  await newsObject.save()
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
    const contents = response.body.map(r => r.content)
    
    expect(contents).toContain(
      'NOTHING is easy'
    )
  })
})  

describe('viewing a specific news', () => {

  test('success with valid id', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToView = newsAtStart[0]
    const resultNews = await api
      .get(`/api/news/${newsToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
        
    const processedNewsToView = JSON.parse(JSON.stringify(newsToView))
    expect(resultNews.body).toEqual(processedNewsToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/news/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/news/${invalidId}`)
      .expect(400)
  })
})
  
describe('addition of a new news', () => {
  test('succeeds with valid data ', async () => {
    const newNews = {
      title: 'Test news added_valid_news',  
      content: 'Added this news',
      date: new Date(),
      url: 'www.testnews3.com',
      image: ''
    }
        
    await api
      .post('/api/news')
      .send(newNews)
      .expect(201)
      .expect('Content-Type', /application\/json/)
        
    const response = await api.get('/api/news')
    const contents = response.body.map(r => r.content)
        
    expect(response.body).toHaveLength(helper.initialNews.length + 1)
    expect(contents).toContain(
      'Added this news'
    )
  })  
  
  test('news without content is not added, fails with status code 400', async () => {
    const newNews = {
      title: 'Test news content missing',  
      date: new Date(),
      url: 'www.testnews3.com',
      image: ''
    }
    await api
      .post('/api/news')
      .send(newNews)
      .expect(400)
  
    const response = await api.get('/api/news')
    expect(response.body).toHaveLength(helper.initialNews.length)
  })

})

describe('deletion and updating of a news', () => {
  test('a news can be deleted', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToDelete = newsAtStart[0]
    await api
      .delete(`/api/news/${newsToDelete.id}`)
      .expect(204)
  
    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd).toHaveLength(
      helper.initialNews.length - 1
    )
    const contents = newsAtEnd.map(r => r.content)
    expect(contents).not.toContain(newsToDelete.content)
  })

  test('a news can be updated', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToUpdate = newsAtStart[0]
    newsToUpdate.content = 'Updated content'
   
    await api
      .put(`/api/news/${newsToUpdate.id}`)
      .send(newsToUpdate)
      .expect(200)
    
    const newsAtEnd = await helper.newsInDb()
    
    expect(newsAtEnd[0].content).toEqual('Updated content')
    expect(newsAtEnd).toHaveLength(
      helper.initialNews.length 
    )
  })
})
afterAll(() => {
  mongoose.connection.close()
})
