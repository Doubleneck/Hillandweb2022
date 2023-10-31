//const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const SongRequest = require('../models/songrequest')
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

  const user2 = new User({
    username: 'someuser',
    role: 'user',
    passwordHash,
  })
  await user2.save()

  const userdata2 = {
    username: 'someuser',
    password: 'sekret',
  }
  const response2 = await supertest(app).post('/api/login').send(userdata2)
  USERTOKEN = response2.body.token

})


describe('addition of a new songrequest', () => {
  beforeEach(async () => {
    await SongRequest.deleteMany({})
    await SongRequest.insertMany(helper.initialSongRequest)
  })

  test('succeeds with valid data (no LOGIN)', async () => {
    const newSongrequest = helper.newSong
    await api
      .post('/api/songrequests')
      .send(newSongrequest)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('succeeds with valid data without artist (no LOGIN)', async () => {
    let newSong= helper.newSong
    newSong.artist = ''
        
    await api
      .post('/api/songrequests')
      .send(newSong)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })
  test('fails with status code 400 if not song (no LOGIN)', async () => {
    const emptySongRequest = {
      song: '',
      date: new Date(),
      artist: 'some artist #2',
    }
    await api
      .post('/api/songrequests')
      .send(emptySongRequest)
      .expect(400)
  })

  test('fails with status code 400 if not date (no LOGIN)', async () => {
    const emptySongRequest = {
      song: '',
      date: null,
      artist: 'some artist #2',
    }
    await api
      .post('/api/songrequests')
      .send(emptySongRequest)
      .expect(400)
  })
})

describe('when there is initially some songrequests saved', () => {
  beforeEach(async () => {
    
    await SongRequest.deleteMany({})
    await SongRequest.insertMany(helper.initialSongRequest)
  })

  test('songrequests are returned as json, (USER logged to see)', async () => {

    const response = await api
      .get('/api/songrequests')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(200) 
    expect(response.headers['content-type']).toMatch(/application\/json/)
  })
  test('there are two songrequests, (USER logged to see)', async () => {
    const response = await api
      .get('/api/songrequests')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(200)
    expect(response.body).toHaveLength(2)
  })

  test('the first songrequests is song:Test song #1 , artist:Test artist #1. (USER logged to see)', async () => {
    const response = await api
      .get('/api/songrequests')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(200)
    expect(response.body[0].song).toBe('Test song #1')
    expect(response.body[0].artist).toBe('Test artist #1')
  })

  test('all songrequests are returned (USER logged to see)', async () => {
    const response = await api
      .get('/api/songrequests')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(200)
    expect(response.body).toHaveLength(helper.initialSongRequest.length)

  })

  test('a specific songrequest is within the returned songrequests', async () => {
    const response = await api
      .get('/api/songrequests')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(200)
    const songs= response.body.map((r) => r.song)
    expect(songs).toContain('Test song #2')
  })

}) 

describe('deleting a songrequest', () => {
  beforeEach(async () => {
    await SongRequest.deleteMany({})
    await SongRequest.insertMany(helper.initialSongRequest)
  })

  test('deleting a songrequest succees if ADMIN', async () => {
    const songrequestsAtStart = await helper.songRequestsInDb()
    const songrequestToDelete = songrequestsAtStart[0]
    await api
      .delete(`/api/songrequests/${songrequestToDelete.id}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(204)

    const songrequestsAtEnd = await helper.songRequestsInDb()
    expect(songrequestsAtEnd).toHaveLength(helper.initialSongRequest.length - 1)
    const songs = songrequestsAtEnd.map((r) => r.song)
    expect(songs).not.toContain(songrequestToDelete.song)
  })

  test('deleting a songrequest fails if USER', async () => {
    const songrequestsAtStart = await helper.songRequestsInDb()
    const songrequestToDelete = songrequestsAtStart[0]
    await api
      .delete(`/api/songrequests/${songrequestToDelete.id}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(401)

    const songrequestsAtEnd = await helper.songRequestsInDb()
    expect(songrequestsAtEnd).toHaveLength(helper.initialSongRequest.length)
    const songs = songrequestsAtEnd.map((r) => r.song)
    expect(songs).toContain(songrequestToDelete.song)
  })
  test('deleting a songrequest fails if NOT LOGGED', async () => {
    const songrequestsAtStart = await helper.songRequestsInDb()
    const songrequestToDelete = songrequestsAtStart[0]
    await api
      .delete(`/api/songrequests/${songrequestToDelete.id}`)
      .expect(401)

    const songrequestsAtEnd = await helper.songRequestsInDb()
    expect(songrequestsAtEnd).toHaveLength(helper.initialSongRequest.length)
    const songs = songrequestsAtEnd.map((r) => r.song)
    expect(songs).toContain(songrequestToDelete.song)
  })
})
