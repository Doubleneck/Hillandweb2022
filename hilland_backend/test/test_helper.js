const News = require('../models/news')
const User = require('../models/user')
const Songrequests = require('../models/songrequest')
const bcrypt = require('bcrypt')
const passwordHash = bcrypt.hash('Someuser@someuser1', 10)
const path = require('path')
const fs = require('fs')
const imagePath = path.resolve(__dirname, '../assets/test_image.jpeg')
const mockImageData = fs.readFileSync(imagePath)
const initialNews = [{
  title: 'Test News',
  content: 'This is a test news article.',
  url: 'https://example.com',
  date: '2023-11-03',
  imageFile: mockImageData, 
}]


const initialSongRequests = [
  {
    song: 'Crazy',
    artist: 'Willie Nelson',
    date: new Date(),
  },
  {
    song: 'Crazy',
    artist: 'Patsy Cline',
    date: new Date(),
  },
  {
    song: 'Weary blues from waiting',
    artist: 'Hank Williams',
    date: new Date(),
  },
]

const nonExistingId = async () => {
  const news = new News({
    title: 'Test news to be removed',
    content: 'will be remnoved',
    date: new Date(),
    url: 'www.testnews2.com',
    image: '',
  })
  await news.save()
  await news.remove()

  return news._id.toString()
}
const songRequestsInDb = async () => {
  const songrequests = await Songrequests.find({})
  return songrequests.map((s) => s.toJSON())
}
const newsInDb = async () => {
  const news = await News.find({})
  return news.map((n) => n.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}


const newSong = () => ({
  song: 'new song',
  artist: 'some artist',
  date: new Date(),
})


const newUser = () => ({
  username: 'someuser@someuser.com',
  role: 'user',
  passwordHash,
})


const userUser = () => ({
  username: 'user@user.com',
  password: 'User@user1',
  role: 'user',
})

const adminUser = () => ({
  username: 'admin@admin.com',
  password: 'Admin@admin1',
  role: 'admin',
})

module.exports = {
  initialSongRequests,
  nonExistingId,
  newsInDb,
  usersInDb,
  songRequestsInDb,
  userUser,
  adminUser,
  newUser,
  initialNews,
  newSong
}
