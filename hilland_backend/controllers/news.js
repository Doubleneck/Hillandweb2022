const newsRouter = require('express').Router()
const News = require('../models/news')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

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
  const token = request.token 
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  
  if (decodedToken.role !== 'admin'){
    return response.status(401).json({ error: 'you don´t have rights for this operation' })
  } 
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
  const token = request.token 
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (request.user.role !== 'admin'){
    return response.status(401).json({ error: 'you don´t have rights for this operation' })
  }
  
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
  const token = request.token 
  
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
 /*  if (request.user.role !== 'admin'){
    return response.status(401).json({ error: 'you don´t have rights for this operation' })
  } */
  await News.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = newsRouter