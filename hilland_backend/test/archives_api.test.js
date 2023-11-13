const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const ArchiveItem = require('../models/archiveitem')

const archiveObject = helper.initialArchiveItem[0]
async function postInitialArchiveItem(app, ADMINTOKEN, archiveObject) {
  return await supertest(app)
    .post('/api/archives')
    .set('Authorization', `Bearer ${ADMINTOKEN}`)
    .field('title', archiveObject.title)
    .field('content', archiveObject.content)
    .field('year', archiveObject.year)
    .attach('imageFile', archiveObject.imageFile, 'sample-image.jpg')
    .expect(201)
}

let ADMINTOKEN = ''
let USERTOKEN = ''

beforeAll(async () => {
  await ArchiveItem.deleteMany({})
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
    
describe('when there is initially some archive items saved', () => {
  beforeEach(async () => {
    await ArchiveItem.deleteMany({})
    await postInitialArchiveItem(app, ADMINTOKEN, archiveObject)
  })

  test('archives are returned as json', async () => {
    await api
      .get('/api/archives')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there is one arhive item', async () => {
    const response = await api.get('/api/archives')
    expect(response.body).toHaveLength(1)
  })

  test('the first arhive item is about HTTP methods', async () => {
    const response = await api.get('/api/archives')
    expect(response.body[0].content).toBe('This is a test archive content.')
  })

  test('a specific archive item is within the returned archive items', async () => {
    const response = await api.get('/api/archives')
    const contents = response.body.map((r) => r.content)
    expect(contents).toContain('This is a test archive content.')
  })
})

describe('viewing a specific archive item', () => {
  beforeEach(async () => {
    await ArchiveItem.deleteMany({})
    await postInitialArchiveItem(app, ADMINTOKEN, archiveObject)
  })

  test('success with valid id without login', async () => {
    const archivesAtStart = await helper.archivesInDb() 
    const archiveitemToView = archivesAtStart [0]
    const resultArchiveItem = await api
      .get(`/api/archives/${archiveitemToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedarchiveitemToView= JSON.parse(JSON.stringify(archiveitemToView))
    expect(resultArchiveItem.body).toEqual(processedarchiveitemToView)
  })

  test('fails with statuscode 404 if archive item does not exist (without login)', async () => {
    const validNonexistingId = await helper.nonExistingId()
    await api.get(`/api/archives/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 if id is invalid (without login)', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    await api.get(`/api/archives/${invalidId}`).expect(400)
  })
})

describe('addition of a new archive item', () => {
  beforeEach(async () => {
    try {
      await ArchiveItem.deleteMany({})
    } catch (error) {
      console.error('Error deleting archive item  entries:', error)
    }
  })

  test('succees with proper data if ADMIN', async () => {
    const archivesAtStart = await helper.archivesInDb() 
    const response = await api
      .post('/api/archives')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .field('title', 'A New Title')
      .field('content', 'Added this archive item')
      .field('year',archiveObject.year)
      .attach('imageFile', archiveObject.imageFile,'sample-image.jpg') // Attach the image file
  
    expect(response.status).toBe(201)
    const archivesAtEnd = await helper.archivesInDb() 
    expect(archivesAtEnd  ).toHaveLength(archivesAtStart .length + 1)
    expect(response.body.content).toEqual('Added this archive item')
  })

  test('fails with valid data if USER', async () => {
    const archivesAtStart = await helper.archivesInDb() 
    const response = await api
      .post('/api/archives')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .field('title', 'A New Title')
      .field('content', 'Added another archive item')
      .field('year',archiveObject.year)
      .attach('imageFile', archiveObject.imageFile,'sample-image.jpg') // Attach the image file
  
    expect(response.status).toBe(401)
    const archivesAtEnd = await helper.archivesInDb() 
    expect(archivesAtEnd  ).toHaveLength(archivesAtStart.length)
    expect(response.body.content).not.toEqual('Added another archive item')
  })  

  test('fails with status code 400 if not title if ADMIN', async () => {
    const archivesAtStart = await helper.archivesInDb() 
    const response = await api
      .post('/api/archives')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .field('title', '')
      .field('content', 'Added another archive item')
      .field('year',archiveObject.year)
      .attach('imageFile', archiveObject.imageFile,'sample-image.jpg') // Attach the image file
      
    expect(response.status).toBe(400)
    const archivesAtEnd = await helper.archivesInDb() 
    expect(archivesAtEnd  ).toHaveLength(archivesAtStart.length)
    expect(response.body.error).toEqual('year or title missing')
  })

  test('fails with status code 400 if not year if ADMIN', async () => {
    const archivesAtStart = await helper.archivesInDb() 
    const response = await api
      .post('/api/archives')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .field('title', 'Some title')
      .field('content', 'Added another archive item')
      .attach('imageFile', archiveObject.imageFile,'sample-image.jpg') // Attach the image file
    expect(response.status).toBe(400)
    const archivesAtEnd = await helper.archivesInDb() 
    expect(archivesAtEnd  ).toHaveLength(archivesAtStart.length)
    expect(response.body.error).toEqual('year or title missing')
  })

  test('fails with status code 400 if not imagefile if ADMIN', async () => {
    const archivesAtStart = await helper.archivesInDb() 
    const response = await api
      .post('/api/archives')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .field('title', 'Some title')
      .field('content', 'Added another archive item')
      .field('year',archiveObject.year)
    expect(response.status).toBe(400)
    const archivesAtEnd = await helper.archivesInDb() 
    expect(archivesAtEnd  ).toHaveLength(archivesAtStart.length)
    expect(response.body.error).toEqual('image missing')
  })
})


describe('deleting and updating of an archive item', () => {
  beforeEach(async () => {
    await ArchiveItem.deleteMany({})
    await postInitialArchiveItem(app, ADMINTOKEN, archiveObject)
  })

  test('deleting an archive item succees if ADMIN', async () => {
    const archivesAtStart = await helper.archivesInDb() 
    const archiveItemToDelete = archivesAtStart[0]
    await api
      .delete(`/api/archives/${archiveItemToDelete.id}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(204)

    const archivesAtEnd = await helper.archivesInDb() 
    expect(archivesAtEnd).toHaveLength(archivesAtStart.length-1)
  })

  test('deleting an archive item fails if USER', async () => {
    const archivesAtStart = await helper.archivesInDb() 
    const archiveItemToDelete = archivesAtStart[0]
    const response = await api
      .delete(`/api/archives/${archiveItemToDelete.id}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(401)
    
    const archivesAtEnd = await helper.archivesInDb() 
    expect(archivesAtEnd).toHaveLength(archivesAtStart.length)
    expect(response.body.error).toEqual('you don´t have rights for this operation')
  })

  test('deleting an archive item fails if not login', async () => {
    const archivesAtStart = await helper.archivesInDb() 
    const archiveItemToDelete = archivesAtStart[0]
    const response = await api
      .delete(`/api/archives/${archiveItemToDelete.id}`)
      .expect(401)
    const archivesAtEnd = await helper.archivesInDb() 
    expect(archivesAtEnd).toHaveLength(archivesAtStart.length)
    expect(response.body.error).toEqual('invalid token')
  })

  test('updating an archive item succees if ADMIN', async () => {
    const archivesAtStart = await helper.archivesInDb() 
    const archiveItemToUpdate = archivesAtStart[0]
    archiveItemToUpdate.content = 'Updated archive item content'
    await api
      .put(`/api/archives/${archiveItemToUpdate.id}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send(archiveItemToUpdate)
      .expect(200)

    const archivesAtEnd = await helper.archivesInDb() 

    expect(archivesAtEnd[0].content).toEqual('Updated archive item content')
    expect(archivesAtEnd).toHaveLength(archivesAtStart.length)
  })

  test('updating an archive item fails if USER', async () => {
    const archivesAtStart = await helper.archivesInDb() 
    const archiveItemToUpdate = archivesAtStart[0]
    archiveItemToUpdate.content = 'Updated archive item content'
    const response = await api
      .put(`/api/archives/${archiveItemToUpdate.id}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send(archiveItemToUpdate)
      .expect(401)

    const archivesAtEnd = await helper.archivesInDb() 
    expect(response.body.error).toEqual('you don´t have rights for this operation')
    expect(archivesAtEnd[0].content).not.toEqual('Updated archive item content')
    expect(archivesAtEnd).toHaveLength(archivesAtStart.length)
  })

  test('updating an archive item fails if not login', async () => {
    const archivesAtStart = await helper.archivesInDb() 
    const archiveItemToUpdate = archivesAtStart[0]
    archiveItemToUpdate.content = 'Updated archive item content'
    const response = await api
      .put(`/api/archives/${archiveItemToUpdate.id}`)
      .send(archiveItemToUpdate)
      .expect(401)

    const archivesAtEnd = await helper.archivesInDb() 
    expect(response.body.error).toEqual('invalid token')
    expect(archivesAtEnd[0].content).not.toEqual('Updated archive item content')
    expect(archivesAtEnd).toHaveLength(archivesAtStart.length)
  })
  
})





