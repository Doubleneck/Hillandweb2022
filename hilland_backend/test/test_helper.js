const News = require('../models/news')
const User = require('../models/user')
const Songrequests = require('../models/songrequest')
const bcrypt = require('bcrypt')
const passwordHash = bcrypt.hash('Someuser@someuser1', 10)  
const initialNews = [
  {
    title: 'Test news #1',
    content: 'HTML is easy',
    date: new Date(),
    url: 'www.testnews.com',
    image: '',
  },
  {
    title: 'Test news #2',
    content: 'NOTHING is easy',
    date: new Date(),
    url: 'www.testnews2.com',
    image: '',
  },
]

const initialSongRequest = [
  {
    song: 'Test song #1',
    artist: 'Test artist #1',
    date: new Date(),
  },
  {
    song: 'Test song #2',
    artist: 'Test artist #2',
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

const newNews = () => ({
  title: 'Test news added_valid_news',
  content: 'Added this news',
  date: new Date(),
  url: 'www.testnews3.com',
  imageURL: 'www.s3.com/something',
})

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
  initialNews,
  initialSongRequest,
  nonExistingId,
  newsInDb,
  usersInDb,
  songRequestsInDb,
  userUser,
  adminUser,
  newUser,
  newNews,
  newSong
}
