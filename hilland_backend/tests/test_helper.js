const News = require('../models/news')
const User = require('../models/user')

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

const nonExistingId = async () => {
  const news = new News(
    {
      title: 'Test news to be removed',  
      content: 'will be remnoved',
      date: new Date(),
      url: 'www.testnews2.com',
      image: ''
    }
  )
  await news.save()
  await news.remove()

  return news._id.toString()
}

const newsInDb = async () => {
  const news = await News.find({})
  return news.map(n => n.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialNews, 
  nonExistingId, 
  newsInDb, 
  usersInDb
}