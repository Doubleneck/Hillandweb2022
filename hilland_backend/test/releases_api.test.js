const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Release = require('../models/release')

const releaseObject = helper.initialReleases[0]
async function postInitialRelease(app, ADMINTOKEN, releaseObject) {

  return await supertest(app)
    .post('/api/releases')
    .set('Authorization', `Bearer ${ADMINTOKEN}`)
    .field('title', releaseObject.title)
    .field('content', releaseObject.content)
    .field('year', releaseObject.year)
    .field('buyLink', releaseObject.buyLink)
    .field('listenLink', releaseObject.listenLink)
    .attach('imageFile', releaseObject.imageFile, 'sample-image.jpg')
    .expect(201)

}

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
    
describe('when there is initially sone release saved', () => {
  beforeEach(async () => {
    await Release.deleteMany({})
    await postInitialRelease(app, ADMINTOKEN, releaseObject)
  })

  test('archives are returned as json', async () => {
    await api
      .get('/api/releases')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there is one release', async () => {
    const response = await api.get('/api/releases')
    expect(response.body).toHaveLength(1)
  })

  test('the first release is about HTTP methods', async () => {
    const response = await api.get('/api/releases')
    expect(response.body[0].title).toBe('Test Release')
  })

  test('a specific release is within the returned releases', async () => {
    const response = await api.get('/api/releases')
    const contents = response.body.map((r) => r.content)
    expect(contents).toContain('This is a test release.')
  })
})

describe('viewing a specific archive item', () => {
  beforeEach(async () => {
    await Release.deleteMany({})
    await postInitialRelease(app, ADMINTOKEN, releaseObject)
  })

  test('success with valid id without login', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const releaseToView = releasesAtStart[0]
    const resultRelease = await api
      .get(`/api/releases/${releaseToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedReleaseToView= JSON.parse(JSON.stringify(releaseToView))
    expect(resultRelease.body).toEqual(processedReleaseToView)
  })

  test('fails with statuscode 404 if release does not exist (without login)', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api.get(`/api/releases/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 if id is invalid (without login)', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    await api.get(`/api/releases/${invalidId}`).expect(400)
  })
})

describe('addition of a new release', () => {
  beforeEach(async () => {
    await Release.deleteMany({})
    await postInitialRelease(app, ADMINTOKEN, releaseObject)
  })

  test('succees with proper data if ADMIN', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const response = await api
      .post('/api/releases')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .field('title', 'A New Title')
      .field('content', 'Added this release item')
      .field('year',releaseObject.year)
      .field('buyLink', releaseObject.buyLink)
      .field('listenLink', releaseObject.listenLink)
      .attach('imageFile', releaseObject.imageFile,'sample-image.jpg') 
  
    expect(response.status).toBe(201)
    const releasesAtEnd = await helper.releasesInDb() 
    expect(releasesAtEnd  ).toHaveLength(releasesAtStart.length + 1)
    expect(response.body.content).toEqual('Added this release item')
  })

  test('fails with valid data if USER', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const response = await api
      .post('/api/releases')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .field('title', 'A New Title')
      .field('content', 'Added this release item')
      .field('year',releaseObject.year)
      .field('buyLink', releaseObject.buyLink)
      .field('listenLink', releaseObject.listenLink)
      .attach('imageFile', releaseObject.imageFile,'sample-image.jpg') 
  
    expect(response.status).toBe(401)
    const releasesAtEnd = await helper.releasesInDb() 
    expect(releasesAtEnd ).toHaveLength(releasesAtStart.length)
    expect(response.body.content).not.toEqual('Added another release item')
  })  

  test('fails with status code 400 if not title if ADMIN', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const response = await api
      .post('/api/releases')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .field('title', '')
      .field('content', 'Added this release item')
      .field('year',releaseObject.year)
      .field('buyLink', releaseObject.buyLink)
      .field('listenLink', releaseObject.listenLink)
      .attach('imageFile', releaseObject.imageFile,'sample-image.jpg') 
      
    expect(response.status).toBe(400)
    const releasesAtEnd = await helper.releasesInDb() 
    expect(releasesAtEnd  ).toHaveLength(releasesAtStart.length)
    expect(response.body.error).toEqual('year or title missing')
  })

  test('fails with status code 400 if not year if ADMIN', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const response = await api
      .post('/api/releases')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .field('title', 'new title')
      .field('content', 'Added this release item')
      .field('year','')
      .field('buyLink', releaseObject.buyLink)
      .field('listenLink', releaseObject.listenLink)
      .attach('imageFile', releaseObject.imageFile,'sample-image.jpg') 
      
    expect(response.status).toBe(400)
    const releasesAtEnd = await helper.releasesInDb() 
    expect(releasesAtEnd  ).toHaveLength(releasesAtStart.length)
    expect(response.body.error).toEqual('year or title missing')
  })

  test('fails with status code 400 if not imagefile if ADMIN', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const response = await api
      .post('/api/releases')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .field('title', 'new title')
      .field('content', 'Added this release item')
      .field('year','2010')
      .field('buyLink', releaseObject.buyLink)
      .field('listenLink', releaseObject.listenLink)
      
      
    expect(response.status).toBe(400)
    const releasesAtEnd = await helper.releasesInDb() 
    expect(releasesAtEnd  ).toHaveLength(releasesAtStart.length)
    expect(response.body.error).toEqual('image missing')
  })

})
describe('deleting and updating of a release', () => {
  beforeEach(async () => {
    await Release.deleteMany({})
    await postInitialRelease(app, ADMINTOKEN, releaseObject)
  })


  test('deleting a release succees if ADMIN', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const releaseToDelete = releasesAtStart[0]
    await api
      .delete(`/api/releases/${releaseToDelete.id}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(204)

    const releasesAtEnd = await helper.releasesInDb() 
    expect(releasesAtEnd).toHaveLength(releasesAtStart.length-1)
  })

  test('deleting a release fails if USER', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const releaseToDelete = releasesAtStart[0]
    const response = await api
      .delete(`/api/releases/${releaseToDelete.id}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(401)
    
    const releasesAtEnd = await helper.releasesInDb() 
    expect(releasesAtEnd).toHaveLength(releasesAtStart.length)
    expect(response.body.error).toEqual('you don´t have rights for this operation')
  })

  test('deleting a release fails if not login', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const releaseToDelete = releasesAtStart[0]
    const response = await api
      .delete(`/api/releases/${releaseToDelete.id}`)
      .expect(401)
    
    const releasesAtEnd = await helper.releasesInDb() 
    expect(releasesAtEnd).toHaveLength(releasesAtStart.length)
    expect(response.body.error).toEqual('invalid token')
  })

  test('updating a release succees if ADMIN', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const releaseToUpdate = releasesAtStart[0]
    releaseToUpdate.content = 'Updated release content'
    await api
      .put(`/api/releases/${releaseToUpdate.id}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send(releaseToUpdate)
      .expect(200)

    const releasesAtEnd = await helper.releasesInDb() 

    expect(releasesAtEnd[0].content).toEqual('Updated release content')
    expect(releasesAtEnd).toHaveLength(releasesAtStart.length)
  })

  test('updating a relesse fails if no title if ADMIN', async () => {
  
    const releasesAtStart = await helper.releasesInDb() 
    const releaseToUpdate = releasesAtStart[0]
    releaseToUpdate.content = 'Updated release content'
    releaseToUpdate.title = ''
    const response = await api
      .put(`/api/releases/${releaseToUpdate.id}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send(releaseToUpdate)
      .expect(400)
    
    const releasesAtEnd = await helper.releasesInDb() 
    
    expect(releasesAtEnd[0].content).not.toEqual('Updated release content')
    expect(releasesAtEnd).toHaveLength(releasesAtStart.length)
    expect(response.body.error).toEqual('year or title missing')
  })
  test('updating an archive item fails if no year if ADMIN', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const releaseToUpdate = releasesAtStart[0]
    releaseToUpdate.content = 'Updated release content'
    releaseToUpdate.year = ''
    const response = await api
      .put(`/api/releases/${releaseToUpdate.id}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send(releaseToUpdate)
      .expect(400)
    
    const releasesAtEnd = await helper.releasesInDb() 
    
    expect(releasesAtEnd[0].content).not.toEqual('Updated release content')
    expect(releasesAtEnd).toHaveLength(releasesAtStart.length)
    expect(response.body.error).toEqual('year must be a number between 2005 and present year')
  })

  test('updating a release fails if USER', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const releaseToUpdate = releasesAtStart[0]
    releaseToUpdate.content = 'Updated release content'
    const response = await api
      .put(`/api/releases/${releaseToUpdate.id}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send(releaseToUpdate)
      .expect(401)

    const releasesAtEnd = await helper.releasesInDb() 

    expect(releasesAtEnd[0].content).not.toEqual('Updated release content')
    expect(releasesAtEnd).toHaveLength(releasesAtStart.length)
    expect(response.body.error).toEqual('you don´t have rights for this operation')
  })
  test('updating a release fails if not login', async () => {
    const releasesAtStart = await helper.releasesInDb() 
    const releaseToUpdate = releasesAtStart[0]
    releaseToUpdate.content = 'Updated release content'
    const response = await api
      .put(`/api/releases/${releaseToUpdate.id}`)
      .send(releaseToUpdate)
      .expect(401)

    const releasesAtEnd = await helper.releasesInDb() 

    expect(releasesAtEnd[0].content).not.toEqual('Updated release content')
    expect(releasesAtEnd).toHaveLength(releasesAtStart.length)
    expect(response.body.error).toEqual('invalid token')
  })
})
