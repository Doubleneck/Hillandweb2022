const newsRouter = require('express').Router()
const News = require('../models/news')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// ...
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

newsRouter.get('/', async (req, res) => {
  const news = await News.find({})
  res.json(news)
})
  
newsRouter.get('/:id', async(request, response) => {
  const news= await News.findById(request.params.id)
  if (news) {
    response.json(news)
  } else {
    response.status(404).end()
  }
})
  
newsRouter.put('/:id',  (request, response, next) => {
  const news = ({
    title: request.body.title,
    content: request.body.content,
    url: request.body.url,
    image: request.body.picture
  })
 
  News.findByIdAndUpdate(request.params.id, news, { new: true })
    .then(updatedNews => {
      response.json(updatedNews)
    })
    .catch(error => next(error))
})
  
newsRouter.post('/', async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  
  const news = new News({
    title: request.body.title,
    content: request.body.content,
    date: new Date(),
    url: request.body.url,
    image: request.body.image
  })
  const savedNews = await news.save()
  response.status(201).json(savedNews)
})

newsRouter.delete('/:id', async (request, response) => {
  await News.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = newsRouter