const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const News = require('../models/news')
const newsObject = helper.initialNews[0]
async function postInitialNews(app, ADMINTOKEN, newsObject) {
  return await supertest(app)
    .post('/api/news')
    .set('Authorization', `Bearer ${ADMINTOKEN}`)
    .field('title', newsObject.title)
    .field('content', newsObject.content)
    .field('url', newsObject.url)
    .field('date', newsObject.date)
    .attach('imageFile', newsObject.imageFile, 'sample-image.jpg')
}

let ADMINTOKEN = ''
let USERTOKEN = ''

beforeAll(async () => {
  await News.deleteMany({})
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
    
describe('when there is initially some news saved', () => {
  beforeEach(async () => {
    await News.deleteMany({})
    await postInitialNews(app, ADMINTOKEN, newsObject)
  })

  test('news are returned as json', async () => {
    await api
      .get('/api/news')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there is one news', async () => {
    const response = await api.get('/api/news')
    expect(response.body).toHaveLength(1)
  })

  test('the first news is about HTTP methods', async () => {
    const response = await api.get('/api/news')
    expect(response.body[0].content).toBe('This is a test news article.')
  })

  test('a specific news is within the returned news', async () => {
    const response = await api.get('/api/news')
    const contents = response.body.map((r) => r.content)
    expect(contents).toContain('This is a test news article.')
  })
})

describe('viewing a specific news', () => {
  beforeEach(async () => {
    await News.deleteMany({})
    await postInitialNews(app, ADMINTOKEN, newsObject)
  })

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

  test('fails with statuscode 404 if news does not exist (without login)', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api.get(`/api/news/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 if id is invalid (without login)', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    await api.get(`/api/news/${invalidId}`).expect(400)
  })
})

describe('addition of a new news', () => {
  beforeEach(async () => {
    try {
      await News.deleteMany({})
    } catch (error) {
      console.error('Error deleting news entries:', error)
    }
  })

  test('succees with proper data if ADMIN', async () => {
    const newsAtStart = await helper.newsInDb()
    const response = await api
      .post('/api/news')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .field('title', 'ANew Title')
      .field('content', 'Added this news')
      .field('url', newsObject.url)
      .field('date', newsObject.date)
      .attach('imageFile', newsObject.imageFile,'sample-image.jpg') // Attach the image file
  
    expect(response.status).toBe(201)
    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd ).toHaveLength(newsAtStart.length + 1)
    expect(response.body.content).toEqual('Added this news')
  })
  

  test('fails with valid data if USER', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsObject = helper.initialNews[0]
    const response = await api
      .post('/api/news')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .field('title', newsObject.title)
      .field('content', 'Added this news')
      .field('url', newsObject.url)
      .field('date', newsObject.date)
      .attach('imageFile', newsObject.imageFile,'sample-image.jpg') // Attach the image file
  
    expect(response.status).toBe(401)
    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd).toHaveLength(newsAtStart.length)
    expect(response.body.error).toEqual('you don´t have rights for this operation')
  })

  test('fails with status code 400 if not content if ADMIN', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsObject = helper.initialNews[0]
    const response = await api
      .post('/api/news')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .field('title', newsObject.title)
      .field('content', '')
      .field('url', newsObject.url)
      .field('date', newsObject.date)
      .attach('imageFile', newsObject.imageFile,'sample-image.jpg') // Attach the image file
  
    expect(response.status).toBe(400)
    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd).toHaveLength(newsAtStart.length)
    expect(response.body.error).toEqual('content or title missing')
  })

  test('fails with status code 400 if not title if ADMIN', async () => {
    const newsAtStart = await helper.newsInDb()
    const response = await api
      .post('/api/news')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .field('title', '')
      .field('content', newsObject.content)
      .field('url', newsObject.url)
      .field('date', newsObject.date)
      .attach('imageFile', newsObject.imageFile,'sample-image.jpg') // Attach the image file
  
    expect(response.status).toBe(400)
    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd).toHaveLength(newsAtStart.length)
    expect(response.body.error).toEqual('content or title missing')
  })

  test('fails with status code 400 if image is missing if ADMIN', async () => {
    const newsAtStart = await helper.newsInDb()
    const response = await api
      .post('/api/news')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .field('title', newsObject.title)
      .field('content', newsObject.content)
      .field('url', newsObject.url)
      .field('date', newsObject.date)
  
    expect(response.status).toBe(400)
    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd).toHaveLength(newsAtStart.length)
    expect(response.body.error).toEqual('image missing')
  })
})

describe('deleting and updating of a news', () => {
  beforeEach(async () => {
    await News.deleteMany({})
    await postInitialNews(app, ADMINTOKEN, newsObject)
  })

  test('deleting a news succees if ADMIN', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToDelete = newsAtStart[0]
    await api
      .delete(`/api/news/${newsToDelete.id}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(204)

    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd).toHaveLength(newsAtStart.length-1)
  })

  test('deleting a news fails if USER', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToDelete = newsAtStart[0]
  
    const response = await api
      .delete(`/api/news/${newsToDelete.id}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(401)

    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd).toHaveLength(newsAtStart.length)
    expect(response.body.error).toEqual('you don´t have rights for this operation')
  })

  test('deleting a news fails if not login', async () => {
   
    const newsAtStart = await helper.newsInDb()
    const newsToDelete = newsAtStart[0]
    
    const response = await api
      .delete(`/api/news/${newsToDelete.id}`)
      .expect(401)
  
    const newsAtEnd = await helper.newsInDb()
    expect(newsAtEnd).toHaveLength(newsAtStart.length)
    expect(response.body.error).toEqual('Authentication failed')
   
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
    expect(newsAtEnd).toHaveLength(newsAtStart.length)
  })

  test('updating a news fails if USER', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToUpdate = newsAtStart[0]
    newsToUpdate.content = 'Updated content'
    const response = await api
      .put(`/api/news/${newsToUpdate.id}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send(newsToUpdate)
      .expect(401)

    const newsAtEnd = await helper.newsInDb()

    expect(newsAtEnd[0].content).not.toEqual('Updated content')
    expect(newsAtEnd).toHaveLength(newsAtStart.length)
    expect(response.body.error).toEqual('you don´t have rights for this operation')
  })

  test('updating a news fails if not login', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToUpdate = newsAtStart[0]
    newsToUpdate.content = 'Updated content'
    const response = await api
      .put(`/api/news/${newsToUpdate.id}`)
      .send(newsToUpdate)
      .expect(401)

    const newsAtEnd = await helper.newsInDb()

    expect(newsAtEnd[0].content).not.toEqual('Updated content')
    expect(newsAtEnd).toHaveLength(newsAtStart.length)
    expect(response.body.error).toEqual('invalid token')
  })
})

