const newsRouter = require('express').Router()
const News = require('../models/news')
const s3 = require('../s3.js')
const { adminCredentialsValidator, userLoggedInValidator } = require('../utils/middleware')  
newsRouter.get('/', async (req, res) => {
  const news = await News.find({})
  res.json(news)
})

newsRouter.get('/:id', async (request, response) => {
  const news = await News.findById(request.params.id)
  if (news) {
    response.json(news)
  } else {
    response.status(404).end()
  }
})

newsRouter.put('/:id', userLoggedInValidator, adminCredentialsValidator, (request, response, next) => {

  const news = {
    title: request.body.title,
    content: request.body.content,
    url: request.body.url,
    imageURL: request.body.imageURL,
  }

  News.findByIdAndUpdate(request.params.id, news, { new: true })
    .then((updatedNews) => {
      response.json(updatedNews)
    })
    .catch((error) => next(error))
})

newsRouter.post('/', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {

  if (request.body.title === '' || request.body.content === '') {
    console.log(response)
    return response
      .status(400)
      .json({ error: 'news must have a title and some content' })
  }

  const news = new News({
    title: request.body.title,
    content: request.body.content,
    date: new Date(),
    url: request.body.url,
    imageURL: request.body.imageURL,
  })
  const savedNews = await news.save()
  response.status(201).json(savedNews)
})

//This is the route for deleting news, it´s also handling the deletion of the image from S3
newsRouter.delete('/:id', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {

  const newsObject_to_be_removed = await News.findById(request.params.id)
  const toBeRemovedS3Id = await newsObject_to_be_removed.imageURL.split('/')[3] 
  await News.findByIdAndRemove(request.params.id)
  await s3.deleteImage(toBeRemovedS3Id)
  return response.status(204).end()
})

module.exports = newsRouter
