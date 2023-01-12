const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const News = require('../models/news')
const bcrypt = require('bcrypt')
const User = require('../models/user')

let TOKEN = ''

beforeAll(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ 
    username: 'root', 
    role: 'admin', passwordHash 
  })
  await user.save()

  const userdata ={
    username: 'root',
    password: 'sekret'
  }  
  const response = await supertest(app)
    .post('/api/login')
    .send(userdata)
  TOKEN = response.body.token
  
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
  beforeEach(async () => {
    await User.deleteMany({})  
    await News.deleteMany({})
    await News.insertMany(helper.initialNews)
  })
  
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
      .set('Authorization', `Bearer ${TOKEN}`)
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
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(newNews)
      .expect(400)
  
    const response = await api.get('/api/news')
    expect(response.body).toHaveLength(helper.initialNews.length)
  })

})

describe('deletion and updating of a news', () => {
  beforeEach(async () => {
    await News.deleteMany({}) 
    let newsObject = new News(helper.initialNews[0])
    await newsObject.save()
    newsObject = new News(helper.initialNews[1])
    await newsObject.save()
  }) 

  test('a news can be deleted', async () => {
    const newsAtStart = await helper.newsInDb()
    const newsToDelete = newsAtStart[0]
    await api
      .delete(`/api/news/${newsToDelete.id}`)
      .set('Authorization', `Bearer ${TOKEN}`)
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
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(newsToUpdate)
      .expect(200)
    
    const newsAtEnd = await helper.newsInDb()
    
    expect(newsAtEnd[0].content).toEqual('Updated content')
    expect(newsAtEnd).toHaveLength(
      helper.initialNews.length 
    )
  })
})
describe('when there is initially one admin-user and one user-user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'adminuser', role: 'admin', passwordHash })
    await user.save()
    const passwordHash2 = await bcrypt.hash('sekret', 10)
    const user2 = new User({ username: 'useruser', role: 'user', passwordHash2 })
    await user2.save()
  })
  
  test('There are two users at start', async () =>{
    const usersAtStart = await helper.usersInDb()
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(usersAtStart.length)
  })

  test('creation fails if not logged', async () => {
    const usersAtStart = await helper.usersInDb()
    const passwordHash = await bcrypt.hash('sekret', 10)
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      role: 'user',
      password: passwordHash,
    }
  
    await api
      .post('/api/users')
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
/*   test('creation fails with proper statuscode if admin logged but username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    const passwordHash = await bcrypt.hash('sekret', 10)
    const newUser = {
      username: 'useruser',
      name: 'Superuser',
      role: 'user',
      password: passwordHash
    }

    const result = await api
      .post('/api/users')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  }) */
})

afterAll(() => {
  mongoose.connection.close()
})
