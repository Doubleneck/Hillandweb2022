const newsRouter = require('express').Router()
const News = require('../models/news')
  
newsRouter.get('/', (req, res) => {
  News.find({})
    .then(news => {
      res.json(news)
    })
})
  
newsRouter.get('/:id', (request, response) => {
  News.findById(request.params.id)
    .then(news => {
      if (news) {
        response.json(news)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
  
newsRouter.put('/:id', (request, response, next) => {
  const news = {
    title: request.body.title,
    content: request.body.content,
    url: request.body.url,
    image: request.body.picture
  }
  
  News.findByIdAndUpdate(request.params.id, news, { new: true })
    .then(updatedNews => {
      response.json(updatedNews)
    })
    .catch(error => next(error))
})
  
newsRouter.post('/', (request, response) => {
  const news = new News({
    title: request.body.title,
    content: request.body.content,
    date: new Date(),
    url: request.body.url,
    image: request.body.image
  })
  news.save().then(savedNews => { 
    console.log('news saved!')
    response.json(savedNews)
  }) 
})

newsRouter.delete('/:id', (request, response) => {
  News.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = newsRouter